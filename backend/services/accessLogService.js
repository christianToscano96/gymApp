import AccessLog from "../models/AccessLog.js";

export const createAccessLog = async (logData) => {
  const log = new AccessLog(logData);
  return await log.save();
};

export const getAllAccessLogs = async () => {
  return await AccessLog.find().sort({ createdAt: -1 });
};

export const getAccessLogsByUser = async (userId) => {
  return await AccessLog.find({ userId }).sort({ createdAt: -1 });
};

export const deleteAccessLog = async (id) => {
  return await AccessLog.findByIdAndDelete(id);
};
