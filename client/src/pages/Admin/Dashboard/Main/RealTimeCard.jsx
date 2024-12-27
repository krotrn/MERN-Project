import { useGetUsersQuery } from "../../../../redux/api/user";
import PrimaryCard from "./PrimaryCard";

const RealTimeCard = () => {
  const { data: response } = useGetUsersQuery();
  const visitors = response?.data;


  return (
    <div className="w-full md:w-[90%] bg-[#1e1e1e] text-white rounded-lg p-6 mt-5">
      <h2 className="text-lg md:text-xl font-bold mb-4">Real-Time Updates </h2>
      <h3 className="text-lg text-center font-bold">{visitors?.length}</h3>
      <p className="text-sm md:text-base">Monitor activity in real time!</p>
      <PrimaryCard />
    </div>
  );
};

export default RealTimeCard;
