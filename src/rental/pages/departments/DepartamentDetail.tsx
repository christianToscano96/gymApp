import { getDepartment } from "@/fake/fake-data-rental";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import Badge from "@/components/ui/badge";
import Avatar from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  ArrowLeft,
  Pencil,
} from "lucide-react";

const DepartamentDetail = () => {
  const { departmentId } = useParams();
  const { data: department, isLoading } = useQuery({
    queryKey: ["departments", departmentId],
    queryFn: () => getDepartment(departmentId ? departmentId : ""),
    staleTime: 1000 * 60 * 5,
  });

  console.log(department);

  const navigate = useNavigate();

  const {
    address,
    area,
    bathrooms,
    bedrooms,
    image,
    status,
    tenant,
    number,
    rent,
  } = department || {};

  return (
    <main className="flex flex-col md:flex-row gap-8 p-6 md:p-12 w-full max-w-5xl mx-auto bg-white rounded-xl shadow-lg">
      <div className="relative w-full md:w-1/2 h-80 md:h-auto flex-shrink-0">
        <img
          src={image}
          alt={address}
          className="w-full h-full object-cover rounded-xl shadow-md"
        />
        {status && (
          <div className="absolute top-4 left-4">
            <Badge status={status}>{status}</Badge>
          </div>
        )}
      </div>

      {/* Detalles */}
      <div className="flex-1 flex flex-col gap-6 justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-gray-500" />
            <span className="text-lg font-semibold text-gray-700">
              {address}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-1">Depto. {number}</h1>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-2xl font-bold text-primary">${rent}</span>
            <span className="text-gray-500 text-sm">/mes</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col items-center">
              <BedDouble className="w-6 h-6 text-gray-500 mb-1" />
              <span className="font-medium">{bedrooms}</span>
              <span className="text-xs text-gray-500">Habitaciones</span>
            </div>
            <div className="flex flex-col items-center">
              <Bath className="w-6 h-6 text-gray-500 mb-1" />
              <span className="font-medium">{bathrooms}</span>
              <span className="text-xs text-gray-500">Baños</span>
            </div>
            <div className="flex flex-col items-center">
              <Ruler className="w-6 h-6 text-gray-500 mb-1" />
              <span className="font-medium">{area} m²</span>
              <span className="text-xs text-gray-500">Área</span>
            </div>
          </div>
        </div>

        {/* tenant */}
        <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-4 shadow-sm">
          <Avatar
            src={tenant || "Sin inquilino"}
            alt={tenant || "Sin inquilino"}
            size="md"
          />
          <div>
            <div className="font-semibold text-gray-700">
              {tenant || "Sin inquilino"}
            </div>
            {tenant && (
              <div className="text-xs text-gray-500">chris@example.com</div>
            )}
          </div>
        </div>

        {/* actions */}
        <div className="flex gap-4 mt-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2 text-gray-500" /> Volver
          </Button>
          <Button variant="default">
            <Pencil className="w-4 h-4 mr-2 text-gray-500" /> Editar
          </Button>
        </div>
      </div>
    </main>
  );
};

export default DepartamentDetail;
