import React from "react";

const Message = (props) => {
  const {
    author = "Aldo",
    waver = "adasdsaskdjakjdlsjasdasdadas",
    text = "hello",
    timestamp,
  } = props;

  return (
    <div className="flex flex-col px-3 py-2 border border-fuchsia-400 space-y-5 shadow-md overflow-x-scroll rounded-md">
      <div className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-col space-y-5 md:space-y-0 md:flex-row w-full">
          <div className="w-6/12">
            <h3 className="font-bold">Author</h3>
            <h4>{author}</h4>
          </div>
          <div className="w-6/12">
            <h3 className="font-bold">Address</h3>
            <h4>{waver}</h4>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-5 md:space-y-0 md:flex-row w-full">
        <div className="w-full md:w-6/12">
          <h3 className="font-bold">Message</h3>
          <h4>{text}</h4>
        </div>
        <div className="w-full md:w-6/12">
          <h3 className="font-bold">Date</h3>
          <h4>
            {timestamp &&
              `${new Date(timestamp * 1000).toLocaleDateString()} - ${new Date(
                timestamp * 1000
              ).getHours()} : ${new Date(timestamp * 1000).getMinutes()}`}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Message;
