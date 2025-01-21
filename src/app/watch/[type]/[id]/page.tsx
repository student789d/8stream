import Options from "@/components/Watch/Options";
import Seasons from "@/components/Watch/Seasons";
import Image from "next/image";
import { Suspense } from "react";
import { getEpisodes } from "@/lib/api";
import PlayButton from "@/components/Watch/PlayButton";
import { getSeasonList } from "@/lib/api";
import type { Metadata } from "next";

async function getData(id: string, type: string) {
  try {
    const resDetails = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}?api_key=${process.env.TMDB_KEY}&language=en-US`
    );
    const resImages = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}/images?api_key=${process.env.TMDB_KEY}&language=en-US&include_image_language=en,null`
    );
    const resExternalIds = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}/external_ids?api_key=${process.env.TMDB_KEY}`
    );
    const externalIds = await resExternalIds.json();
    const details = await resDetails.json();
    const images = await resImages.json();
    return {
      details,
      images,
      externalIds,
    };
  } catch (error) {
    console.log(error);
    return {
      details: [],
      images: [],
      externalIds: [],
    };
  }
}

const page = async ({ params }: { params: { id: string; type: string } }) => {
  const data = await getData(params.id, params.type);
  // height >= 1080
  const filteredImages = data?.images?.backdrops?.filter(
    (image: any) => image.height >= 1000
  );
  return (
    <div className=" overflow-hidden relative">
      <Image
        unoptimized={true}
        priority={true}
        src={`https://image.tmdb.org/t/p/original${
          filteredImages?.[
            Math.floor(Math.random() * (filteredImages?.length || 0))
          ]?.file_path
        }`}
        alt={"title"}
        width={1920}
        height={1080}
        className="object-cover w-full h-[500px] lg:h-[700px] absolute top-0 left-0"
      />
      {/* left right and bottom to top  */}
      <div className="absolute top-0 left-0 w-full h-[500px] lg:h-[700px] bg-gradient-to-t from-black to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black to-transparent"></div>
      <div className=" flex flex-row max-sm:gap-7 max-sm:flex-col justify-start items-center w-full lg:h-full max-sm:h-[800px]">
        <div className=" top-0 flex flex-col justify-start gap-10 z-20 ml-8 h-full">
          {data?.images?.logos?.length > 0 ? (
            <Image
              unoptimized={true}
              src={`https://image.tmdb.org/t/p/original${data.images?.logos[0]?.file_path}`}
              alt={data.details?.title}
              width={1920}
              height={1080}
              className="object-contain w-[200px] h-[200px] lg:w-[300px] lg:h-[300px]"
            />
          ) : (
            <h1 className="text-white text-4xl lg:text-6xl font-semibold mt-[250px]">
              {data.details?.title}
            </h1>
          )}
          {/* rating */}
          <div className="flex gap-4 mt-4 justify-start items-center">
            <div className="flex justify-start items-center">
              <p className="bg-[#F9CC0B] text-[#02040A] rounded-full px-2 py-1 text-base font-bold">
                TMDB
              </p>
              <p className=" rounded-full px-3 py-1 text-xl text-white font-extrabold">
                {data.details?.vote_average?.toFixed(1)}
              </p>
            </div>
            <p className="text-white text-xl font-medium">
              {data.details?.release_date?.slice(0, 4)}
            </p>
            <p className="text-white text-xl font-medium">
              {data.details?.runtime ? data.details?.runtime + " min" : ""}
              {data.details?.episode_run_time?.[0]
                ? data.details?.episode_run_time?.[0] + " min"
                : ""}
            </p>
          </div>

          <p className="text-white text-sm lg:text-sm font-medium max-w-[500px] ">
            {data.details?.overview?.length > 350
              ? data.details?.overview?.slice(0, 350) + "..."
              : data.details?.overview}
          </p>
          {/* tags */}
          <div className="flex gap-2">
            {data.details?.genres?.map((genre: any) => {
              return (
                <p
                  key={genre?.id}
                  className=" cursor-pointer bg-white/30 bg-opacity-100 backdrop-blur-lg  px-2 py-1 text-sm text-white font-medium rounded-full max-sm:text-xs"
                >
                  {genre?.name}
                </p>
              );
            })}
          </div>
          <Options />
        </div>
        <div className="flex flex-col justify-end items-end flex-1 h-[500px] z-20 mr-5">
          <PlayButton
            getSeasonList={getSeasonList}
            imdbId={data?.externalIds?.imdb_id}
            tmdbId={params.id}
            type={params.type}
          />
        </div>
      </div>
      {/* Seasons */}
      <Suspense
        fallback={
          <div className="fixed inset-0 flex justify-center items-center">
            <span className="loader"></span>
          </div>
        }
      >
        <Seasons
          id={{
            tmdb: params.id,
            imdb: data.externalIds?.imdb_id,
          }}
          getEpisodes={getEpisodes}
          type={params.type}
        />
      </Suspense>
    </div>
  );
};

export default page;

export async function generateMetadata({
  params,
}: {
  params: { id: string; type: string };
}): Promise<Metadata> {
  const data = await getData(params.id, params.type);
  return {
    title: data.details?.title,
    description: `watch ${data.details?.title} free online ${data.details?.overview}`,
    keywords: data.details?.genres?.map((genre: any) => genre?.name),
    category: data.details?.genres?.map((genre: any) => genre?.name),
  };
}
