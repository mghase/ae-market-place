import { useGlobalState } from '../store'
import nftLogo from  '../logo.svg'  
import Button from "./Button";
import { useStore } from "../store/store";
import Loader from "./Loading";

const Header = () => {
 const fetchAccount = useStore(state=>state.fetchAccount)
   const connectedAccount = useStore(state=>state.connectedAccount)
   const address = useStore(state=>state.address)
   const loading = useStore(state=>state.btnLoading)
   return (
    <nav className="w-4/5 flex md:justify-center justify-between items-center py-4 mx-auto">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <img
          className="w-32 cursor-pointer"
          src={nftLogo}
          alt="Timeless Logo"
        />
      </div>

      <ul
        className="md:flex-[0.5] text-white md:flex
        hidden list-none flex-row justify-between 
        items-center flex-initial"
      >
        <li className="mx-4 cursor-pointer">Market</li>
        <li className="mx-4 cursor-pointer">Artist</li>
        <li className="mx-4 cursor-pointer">Features</li>
        <li className="mx-4 cursor-pointer">Community</li>
      </ul>

      {!connectedAccount ? (
        <button
          className="shadow-xl shadow-black text-white
        bg-[#e32970] hover:bg-[#bd255f] md:text-xs p-2
          rounded-full cursor-pointer"
          onClick={fetchAccount}
        >
          Connect Wallet {loading ?( <Loader/>):( <></>)}
        </button>
      ) : (
         <Button title={`${address.slice(0, 6)}...${address.slice(-5)}`} />
      )}
     
    </nav>
  )
}

export default Header