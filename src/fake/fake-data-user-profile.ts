import type { UserProfile } from "@/user-preview/interface/user.profile.iterfaces";

export const mockUserData: UserProfile = {
  id: "a1b2c3d4-0001-0000-0000-000000000001",
  name: "Carlos Mendoza",
  email: "carlos.mendoza@email.com",
  phone: "+1 (555) 123-4567",
  avatar: "/gym-member-avatar.png",
  joinDate: "2023-03-15",
  dueDate: "2024-12-31",
  membershipType: "Premium",
  membershipStatus: "active",
  qrCode: "GYM-MEMBER-001-2024",
}