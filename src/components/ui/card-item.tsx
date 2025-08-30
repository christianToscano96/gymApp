import React from "react";
import Avatar from "./avatar";
import type { Staff, Tenant } from "@/rental/interfaces/rental.interfaces";
import Badge from "./badge";
import { DollarSign, Calendar, Phone, Mail } from "lucide-react";
import { getTenant } from "@/fake/fake-data-rental";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./skeleton";

interface CardItemProps {
  data?: Tenant | Staff | undefined;
  id?: string | "";
}

const CardItem: React.FC<CardItemProps> = ({ data, id }) => {
  const { data: tenant, isLoading } = useQuery({
    queryKey: ["tenant", id],
    queryFn: () => getTenant(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="border p-5 mb-5 rounded-lg shadow-sm h-40 flex flex-col justify-between animate-pulse bg-white/70">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 mb-2">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div>
              <Skeleton className="h-4 w-32 mb-2 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          </div>
          <div className="flex flex-col items-end w-100 justify-center flex-1 gap-2">
            <Skeleton className="h-6 w-16 rounded" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
      </div>
    );
  }

  // Type guard para Tenant
  const item = (tenant || data) as Tenant | Staff | undefined;
  const name = item?.name || "";
  const email = item?.email || "";
  const phone = item?.phone || "";
  const status = item?.status || "";
  const avatar = (item as Tenant)?.avatar || "";
  const apartment = (item as Tenant)?.apartment || "";
  const rent = (item as Tenant)?.rent;
  const dueDate = (item as Tenant)?.dueDate;

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
