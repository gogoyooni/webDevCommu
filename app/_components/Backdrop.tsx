import Loader from "./Loader";

const Backdrop = () => {
  return (
    <div className="fixed top-0 left-0 bg-white/30 backdrop-blur-md w-screen h-screen z-20">
      <div className="h-screen w-screen flex items-center justify-center">
        {/* <div className=""> */}
        <Loader className="w-10 h-10 animate-spin " />
        {/* </div> */}
      </div>
    </div>
  );
};

export default Backdrop;
