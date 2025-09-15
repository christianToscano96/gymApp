// src/api/trainerService.ts
import axios from "axios";

// Guarda los trainees en trainerData del trainer
export async function saveTrainerTrainees(trainerId: string, traineeIds: string[]) {
  return axios.put(`/api/trainers/${trainerId}/trainees`, { trainees: traineeIds });
}
