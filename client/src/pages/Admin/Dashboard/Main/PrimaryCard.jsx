import { useGetUsersQuery } from "../../../../redux/api/user";

const PrimaryCard = () => {
  const { data: response } = useGetUsersQuery();
  const visitors = response?.data;

  return (
    <div className="w-full md:w-[90%] bg-[#282828] text-white rounded-lg p-6 mt-5">
      <h2 className="text-xl md:text-2xl font-bold mb-4">Congratulations!</h2>
      <p className="text-sm md:text-base">
        You have {visitors?.length || 0} new users watching your content.
      </p>
    </div>
  );
};

export default PrimaryCard;
