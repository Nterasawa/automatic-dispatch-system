import { useState } from "react";
import { arrangeCarsByAI } from "../services/openaiApi"; // claudeApi から openaiApi に変更
import { AttendanceData } from "../types/attendance";
import { DatabaseService } from "../services/database"; // Assuming this import is needed
import { CarArrangement } from "../types/carArrangement"; // Assuming this import is needed
import { useEffect } from "react"; // Added this import


export const useCarArrangement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [carArrangement, setCarArrangement] = useState<CarArrangement[]>([]); // Added state for car arrangement
  const [eventId, setEventId] = useState<string | null>(null); // Added state for eventId.  Needs to be set elsewhere in your component.


  useEffect(() => {
    // Load arrangement on component mount, assuming eventId is set before this hook runs.
    loadArrangement();
  }, [eventId]);


  const arrangeCards = async (
    attendances: AttendanceData[],
    specialInstructions: string,
    forceNew: boolean = false,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await arrangeCarsByAI(attendances, specialInstructions);
      // Save the arrangement after successful AI processing
      await saveArrangement(result);
      return result;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "配車の計算に失敗しました",
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const saveArrangement = async (arrangement: CarArrangement[]) => {
    if (!eventId) return;
    try {
      await DatabaseService.saveCarArrangement(eventId, arrangement);
      setCarArrangement(arrangement);
      localStorage.setItem(`car_arrangement_${eventId}_backup`, JSON.stringify(arrangement));
    } catch (error) {
      console.error('配車情報の保存に失敗しました:', error);
    }
  };

  const loadArrangement = async () => {
    if (!eventId) return;
    try {
      const mainData = await DatabaseService.getCarArrangement(eventId);
      if (mainData) {
        setCarArrangement(mainData.arrangement);
      } else {
        const backupData = localStorage.getItem(`car_arrangement_${eventId}_backup`);
        if (backupData) {
          const parsed = JSON.parse(backupData);
          setCarArrangement(parsed);
          await DatabaseService.saveCarArrangement(eventId, parsed);
        }
      }
    } catch (error) {
      console.error('配車情報の読み込みに失敗しました:', error);
    }
  };

  return {
    arrangeCards,
    isLoading,
    error,
    carArrangement, //Expose carArrangement
    saveArrangement, //Expose saveArrangement
    loadArrangement, //Expose loadArrangement
    setEventId //Expose setEventId
  };
};