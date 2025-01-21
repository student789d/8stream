import Image from "next/image";
import Link from "next/link";

const Card = ({ media }: { media: any }) => {
  return (
    <Link
      href={`/watch/${media?.media_type ? media.media_type : "movie"}/${
        media?.id
      }`}
    >
      <div className="flex flex-col justify-center items-center group">
        <div className="relative">
          {media?.adult && (
            <div className="absolute top-1 -right-0 bg-red-500 rounded-sm p-[2px] text-xs text-white font-medium z-20 scale-0 group-hover:scale-100 transition-all duration-200 origin-right">
              18+
            </div>
          )}
          <Image
            unoptimized={true}
            width={300}
            height={450}
            src={`https://image.tmdb.org/t/p/w300${media?.poster_path}`}
            alt={"poster"}
            className="rounded-lg max-w-[170px] w-auto h-[150px] sm:h-[200px] lg:h-[250px] object-cover group-hover:scale-105 transition-all duration-200"
          />
          <div className="absolute items-center bottom-2 left-1 z-20 flex group-hover:scale-100 gap-1 scale-0 transition-all duration-200 origin-left">
            <p className="bg-[#F9CC0B] text-[#02040A] rounded-full px-2 py-1 text-xs  font-medium">
              TMDB
            </p>
            <p className=" rounded-full px-2 py-1 text-sm text-white font-semibold">
              {media?.vote_average?.toFixed(1)}
            </p>
          </div>
          <div className="absolute -bottom-[.5px] left-0 w-full max-w-[170px] h-[250px] rounded-lg bg-gradient-to-b from-transparent to-black opacity-80 hidden group-hover:block group-hover:scale-105"></div>
        </div>
        <div className="flex justify-center items-center w-[90%]">
          <p className="text-white text-xs sm:text-sm mt-2 text-center font-medium ">
            {media?.title?.length > 30
              ? media?.title.slice(0, 30) + "..."
              : media?.title}
            {media?.name?.length > 30
              ? media?.name.slice(0, 30) + "..."
              : media?.name}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
