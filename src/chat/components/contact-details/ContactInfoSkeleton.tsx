const ContactInfoSkeleton = () => {
  return (
    <div className="p-4 animate-pulse">
      <div className="flex flex-col items-center pb-6 border-b">
        <div className="h-20 w-20 rounded-full bg-gray-300 mb-3" />
        <div className="h-5 w-32 bg-gray-300 rounded mb-2" />
        <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
        <div className="flex items-center mt-1">
          <div className="h-2 w-2 rounded-full bg-gray-300 mr-1"></div>
          <div className="h-3 w-12 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="py-4 space-y-4">
        <div>
          <div className="h-4 w-36 bg-gray-300 rounded mb-2" />
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <div className="h-3 w-16 bg-gray-200 rounded" />
              <div className="h-3 w-24 bg-gray-200 rounded" />
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="h-3 w-16 bg-gray-200 rounded" />
              <div className="h-3 w-20 bg-gray-200 rounded" />
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        <div>
          <div className="h-4 w-32 bg-gray-300 rounded mb-2" />
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <div className="h-3 w-12 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="h-8 w-full bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default ContactInfoSkeleton;
