import React from "react";
import Avatar from "./avatar";
import type { Staff, Tenant } from "@/rental/interfaces/rental.interfaces";
import Badge from "./badge";
import { DollarSign, Calendar, Phone, Mail } from "lucide-react";

interface CardItemProps {
  data: Tenant | Staff;
}

const CardItem: React.FC<CardItemProps> = ({
  data: { name, email, phone, apartment, rent, status, dueDate, avatar = "" },
}) => {
  return (
    <div className="border p-5 mb-5 rounded-lg shadow-sm hover:shadow-md transition-shadow h-40 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 mb-2">
          <Avatar alt={name} src={avatar} />
          <div>
            <div>{name}</div>
            <div className="text-sm text-gray-500">{apartment}</div>
          </div>
        </div>
        <div className="flex flex-col items-end w-100 justify-center flex-1">
          {rent && (
            <div className="text-xl font-semibold flex items-center">
              <DollarSign />
              {rent}
            </div>
          )}
          <Badge status={status}>{status}</Badge>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Phone /> {phone}
        </div>
        <div className="flex items-center gap-2">
          <Mail /> {email}
        </div>
        {dueDate && (
          <div className="flex items-center gap-2">
            <Calendar /> {dueDate}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardItem;
