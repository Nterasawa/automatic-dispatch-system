import { AttendanceData } from "../types/attendance";

type CarArrangementResponse = {
  driver: string;
  passengers: {
    type: "member" | "family" | "coach";
    name: string;
  }[];
}[];

export const arrangeCarsByAI = async (
  attendances: AttendanceData[],
  specialInstructions?: string,
) => {
  // ドライバーの抽出
  const drivers = attendances.filter(
    (a) => a.status === "○" && a.canDrive === "○",
  );

  if (drivers.length === 0) {
    throw new Error("配車可能な車がありません");
  }

  // 乗車が必要な人の抽出
  const passengersNeedingRides = attendances
    .filter(
      (a) =>
        a.status === "○" &&
        // 団員は常に配車対象
        ((a.role === "団員" && a.canDrive === "×") ||
          // コーチは配車調整が○の場合のみ対象
          (a.role === "コーチ" &&
            a.canDrive === "×" &&
            a.needsCarArrangement === "○")),
    )
    .map((a) => ({
      name: a.memberName,
      type: a.role,
      family_members: a.familyPassengers,
    }));

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-1106",
        messages: [
          {
            role: "system",
            content: `You are a car arrangement specialist. Follow these rules strictly:
1. Driver MUST be counted in the total car capacity
2. Available seats includes the driver
3. Example: If a car has 3 available seats, it means 1 driver + 2 passengers maximum
4. Priority order: Members > Coaches > Family members
5. Family members must ride with their related member
6. NEVER exceed car capacity limits
7. Only arrange coaches who need car arrangement`,
          },
          {
            role: "user",
            content: `Arrange cars with these strict constraints:

Available Cars (total_seats INCLUDES driver):
${JSON.stringify(
  drivers.map((d) => ({
    driver: d.memberName,
    total_seats: d.availableSeats,
    max_passengers: d.availableSeats - 1, // Maximum passengers excluding driver
    has_family: d.familyPassengers > 0,
    family_seats_needed: d.familyPassengers,
  })),
  null,
  2,
)}

Passengers Needing Rides:
${JSON.stringify(passengersNeedingRides, null, 2)}

Special Instructions:
${specialInstructions || "None"}

CRITICAL RULES:
- Each car's total_seats includes the driver
- Maximum passengers = total_seats - 1 (driver)
- Never exceed max_passengers per car
- Only arrange coaches marked for car arrangement
- Keep families together
- Prioritize members over coaches

Please respond in this JSON format only:
{
  "cars": [
    {
      "driver": "driver_name",
      "passengers": [
        {"type": "member|coach|family", "name": "passenger_name"}
      ]
    }
  ]
}`,
          },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Response Error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    // 結果の検証
    result.cars.forEach((car: any) => {
      const driver = drivers.find((d) => d.memberName === car.driver);
      if (!driver) {
        throw new Error(`Driver ${car.driver} not found`);
      }

      // ドライバーを含めた総乗車人数を計算
      const totalPassengers = car.passengers.length + 1; // +1 for driver

      if (totalPassengers > driver.availableSeats) {
        throw new Error(
          `Car capacity exceeded for ${car.driver}'s car. Capacity: ${driver.availableSeats} (including driver), Current: ${totalPassengers}`,
        );
      }
    });

    return result.cars;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(`配車の計算に失敗しました: ${errorMessage}`);
  }
};
