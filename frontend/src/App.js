import React from "react";
import Message from "./Components/Message";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import useCheckWallet from "./hooks/useCheckWallet";

function App() {
  const { account, connect, contract, loading } = useCheckWallet();
  const [text, setText] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [, setModalOpen] = React.useState(false);
  const [wavesArray, setWavesArray] = React.useState([]);
  const [totalWaves, setTotalWaves] = React.useState(null);

  const onChangeTextHandler = (e) => {
    const textLength = text.split("").length;
    if (textLength < 50) {
      setText(e.target.value);
    } else {
      const newText = e.target.value.split("").splice(0, 50).join("");
      setText(newText);
    }
  };

  const onSubmitFormHandler = async (e) => {
    try {
      e.preventDefault();
      const newWave = await contract.addWaveHandler(text, author, {
        gasLimit: 300000,
      });
      setAuthor("");
      setText("");
      await newWave.wait();
      await getAllWavesHandler();
    } catch (error) {
      console.log(error);
      toast.error("Wait 15 minutes to send another message", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const onCloseModal = () => {
    setModalOpen(false);
  };

  const getAllWavesHandler = async () => {
    try {
      const waves = await contract.getAllWaves();
      const totalWaves = await contract.getCountWaves();
      setWavesArray(waves);
      setTotalWaves(totalWaves.toNumber());
    } catch (error) {
      console.log(error, "error");
    }
  };

  React.useEffect(() => {
    if (account !== null) {
      setModalOpen(false);

      getAllWavesHandler();
    } else {
      setModalOpen(true);
    }
  }, [account]);

  React.useEffect(() => {
    const onNewWave = (from, timestamp, text, author) => {
      setWavesArray((prevState) => [
        ...prevState,
        {
          waver: from,
          timestamp,
          text,
          author,
        },
      ]);
    };
    if (window.ethereum) {
      contract.on("NewWave", onNewWave);
    }
    return () => {
      if (contract) {
        contract.off("NewWave", onNewWave);
      }
    };
  }, []);

  return (
    <>
      <div className="flex flex-col space-y-10 items-center justify-center h-screen bg-gradient-to-r from-violet-500 to-fuchsia-500">
        <div className="flex flex-col w-10/12 md:w-8/12 bg-white px-5 py-5 shadow-lg rounded-md space-y-5">
          <div className="w-full text-center">
            <h1 className="text-sm sm:textmd md:text-xl lg:text-2xl xl:text-3xl font-bold tracking-wider">
              👋 Hey there! I'am Aldo
            </h1>
          </div>

          <form
            className="flex w-full flex-col space-y-3"
            onSubmit={onSubmitFormHandler}
          >
            <div className="flex flex-col md:flex-row items-center w-full space-y-2 md:space-y-0 md:space-x-2">
              <div className="w-full md:w-3/12">
                <label htmlFor="author" className="font-semibold text-sm">
                  Author
                </label>
                <input
                  disabled={!account}
                  type="text"
                  maxLength={50}
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  name="author"
                  className="border px-2 py-3 rounded-md focus:outline-fuchsia-500 w-full"
                />
              </div>
              <div className="w-full md:w-9/12">
                <div className="flex flex-row justify-between">
                  <label htmlFor="text" className="font-semibold text-sm">
                    Text
                  </label>
                  <span className="text-xs opacity-50">{`${
                    text.split("").length
                  }/50`}</span>
                </div>
                <input
                  disabled={!account}
                  value={text}
                  onChange={onChangeTextHandler}
                  name="text"
                  className="border w-full px-2 py-3 rounded-md outlined-none focus:outline-fuchsia-500"
                />
              </div>
            </div>
            <div>
              <button
                disabled={!text || !author || !account}
                className="w-full px-3 py-2  bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white font-semibold uppercase rounded-md shadow-md"
              >
                Send
              </button>
            </div>
          </form>
        </div>
        <div className="flex flex-col w-10/12 md:w-8/12 bg-white p-8 pt-4 shadow-lg rounded-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Messages</h2>
            {totalWaves !== null && <p>Total : {totalWaves}</p>}
          </div>
          <div className="space-y-3 h-64 max-h-64 md:h-96 md:max-h-96 overflow-y-scroll">
            {wavesArray.length > 0 && account ? (
              wavesArray.map((message) => <Message {...message} />)
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="font-semibold text-lg tracking-wide">
                  NO MESSAGES
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal
        open={!account && !loading}
        onClose={onCloseModal}
        center
        showCloseIcon={false}
      >
        <div className="w-80 text-center mb-5">
          <h2 className="font-semibold text-xl">Connect Wallet Account</h2>
        </div>
        <div className="w-80">
          <button
            onClick={connect}
            className="w-full px-3 py-2 outline-none bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white font-semibold uppercase rounded-md shadow-md"
          >
            CONNECT ACCOUNT
          </button>
        </div>
      </Modal>
      <ToastContainer />
    </>
  );
}

export default App;
