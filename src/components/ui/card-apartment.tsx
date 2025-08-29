import { Apartment } from "../../rental/interfaces/rental.interfaces";
import Badge from "./badge";

import { MapPin } from "lucide-react";
import { Button } from "./button";
import { NavLink } from "react-router";
import { useNavigate } from "react-router";

interface CardApartmentProps {
  apartment: Apartment;
}

const CardApartment = ({
  apartment: {
    image,
    number,
    status,
    address,
    rent,
    bedrooms,
    bathrooms,
    area,
    tenant,
    id,
  },
}: CardApartmentProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-100 h-145 border rounded-lg mb-4 shadow-md">
      <div className="relative">
        <img
          src={image}
          alt={number}
          className="w-full h-70 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2">
          <Badge status={status}>{status}</Badge>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold">{number}</h2>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-2">
          <MapPin className="inline mr-1" />
          <h2>{address}</h2>
        </div>

        <div className="flex items-center text-sm text-gray-500 mt-5 justify-between">
          <div>Monthly rent:</div>
          <div>
            <h2 className="text-lg  text-black font-bold">${rent}</h2>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-500 mt-2 justify-start gap-5 border-b pb-2">
          <div>{bedrooms} rooms</div>
          <div>{bathrooms} bath</div>
          <div>{area}m2</div>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-2 justify-between gap-5 mt-5">
          <div>Tenant:</div>
          <div className="text-black font-bold text-lg">{tenant}</div>
        </div>
        <div className="flex items-center justify-between mt-5 gap-2">
          <NavLink to={`/rental/departments/${id}`}>
            <Button
              variant="outline"
              size="lg"
              className="w-40"
              onClick={() => navigate("/rental/departments/")}
            >
              Details
            </Button>
          </NavLink>
          <Button variant="outline" size="lg" className="w-40">
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardApartment;
