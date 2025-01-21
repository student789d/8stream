"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hook";
import { toggleEpModal } from "@/redux/slices/epModal";
import Image from "next/image";
import { IoPlay } from "react-icons/io5";
import { setSeason } from "@/redux/slices/options";
import { useRouter } from "next/navigation";
import { FaChevronDown } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";

const Seasons = ({
  id,
  getEpisodes,
  type,
}: {
  id: {
    tmdb: string;
    imdb: string;
  };
  getEpisodes: (id: string, season_number: number) => Promise<any>;
  type: string;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const opt = useAppSelector((state) => state.options);
  const season = useAppSelector((state) => state.options.season);
  const epModal = useAppSelector((state) => state.epModal.epModal);
  const [episodes, setEpisodes] = useState<any>([]);
  const seasonInfo = useAppSelector((state) => state.options.seasonInfo);

  useEffect(() => {
    async function getSeasons() {
      const data = await getEpisodes(id.tmdb, season);
      setEpisodes(data?.filter((item: any) => item?.still_path !== null));
    }
    getSeasons();
  }, [id, season]);
  return (
    <AnimatePresence>
      {epModal && (
        <motion.div
          // slide from bottom
          initial={{ y: 1000 }}
          animate={{ y: 0 }}
          exit={{ y: 1000 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0  flex justify-center items-end z-50"
          onClick={() => {
            dispatch(toggleEpModal(false));
          }}
        >
          <div
            className="bg-white bg-opacity-10 backdrop-blur-sm p-5 max-md:h-[500px] h-[700px] w-[700px]
      flex flex-col gap-3 rounded-t-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center gap-5">
              {/* seasons */}
              <select
                className="bg-white/20 backdrop-blur-lg rounded-lg px-2 py-1 text-sm text-white font-medium styled-select outline-none"
                value={opt.season}
                onChange={(e) => dispatch(setSeason(e.target.value))}
              >
                {seasonInfo?.map((item: any, i: number) => {
                  return (
                    <option
                      key={i}
                      className="px-1 bg-gray-900 text-center  hover:bg-gray-600 rounded-lg"
                      value={i + 1}
                    >
                      Season {i + 1}
                    </option>
                  );
                })}
              </select>
              {/* close button */}
              <div
                className="flex justify-center items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-2 cursor-pointer hover:bg-opacity-30"
                onClick={() => {
                  dispatch(toggleEpModal(false));
                }}
              >
                <FaChevronDown className="text-white text-base" />
              </div>
            </div>
            <div className="flex flex-col gap-3 pr-1 overflow-y-scroll">
              {episodes
                ?.slice(0, seasonInfo?.[season - 1]?.totalEpisodes || 9999)
                ?.map((episode: any, i: number) => {
                  return (
                    <div
                      key={episode?.id}
                      className="flex bg-white bg-opacity-10 backdrop-blur-md rounded-lg justify-start items-center gap-3 p-2 cursor-pointer hover:bg-opacity-20 bg group"
                      onClick={() => {
                        router.push(
                          `/watch/${type}/${id.tmdb}/${id.imdb}?episode=${
                            i + 1
                          }&season=${season}`
                        );
                      }}
                    >
                      <div className="relative">
                        <Image
                          unoptimized={true}
                          src={`https://image.tmdb.org/t/p/original${episode?.still_path}`}
                          alt={episode?.name}
                          width={200}
                          height={200}
                          className="object-cover w-[180px] h-[100px] rounded-lg"
                        />
                        <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <IoPlay className="text-white text-4xl" />
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col gap-2">
                        <h1 className="text-white max-sm:text-sm text-xl font-medium">
                          {episode?.episode_number}. {episode?.name}
                        </h1>
                        <h1 className="text-white text-xs max-sm:text-[9px] font-medium">
                          {episode?.overview?.length > 100
                            ? episode?.overview?.slice(0, 100) + "..."
                            : episode?.overview}
                        </h1>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Seasons;
