import {
  useGlobalState,
  setGlobalState,
  setLoadingMsg,
  setAlert,
} from '../store'
//import { mintNFT } from '../TimelessNFT'
import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { create } from 'ipfs-http-client'
import { useStore } from "../store/store";
const client = create({url:'https://ipfs.infura.io:5001/api/v0'})

const CreateNFT = () => {
  const setModal = useStore(state=>state.setModal)
  const modal = useStore(state=>state.modal)
  const updateModal = useStore(state=>state.setUpdateModal)
 // const [modalx] = useGlobalState('modal')
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [imgBase64, setImgBase64] = useState(null)

  const onChange = async (e:any) => {
    const reader = new FileReader()
    if (e.target.files[0]) reader.readAsDataURL(e.target.files[0])

    reader.onload = (readerEvent:any) => {
      const file = readerEvent.target.result
      setImgBase64(file)
      setFileUrl(e.target.files[0])
    }
  }

  const handleSubmit = async (e:HTMLFormElement) => {
    e.preventDefault()

    if (!name || !price || !description) return
    
    setModal('scale-0')
    setGlobalState('loading', { show: true, msg: 'Uploading IPFS data...' })

    try {
      const created = await client.add(fileUrl)
      const metadataURI = `https://ipfs.infura.io/ipfs/${created.path}`
      const nft = { name, price, description, metadataURI }
      setLoadingMsg('Intializing transaction...')

      // mintNFT(nft).then((res) => {
      //   if (res) {
      //     setFileUrl(metadataURI)
      //     resetForm()
      //     setAlert('Minting completed...', 'green')
      //     window.location.reload()
      //   }
      // })
    } catch (error) {
      console.log('Error uploading file: ', error)
      setAlert('Minting failed...', 'red')
    }
  }

  const closeModal = () => {
   // setGlobalState('modal', 'scale-0')
    setModal('scale-0')
    resetForm()
  }

  const resetForm = () => {
    setFileUrl('')
    setImgBase64(null)
    setName('')
    setSymbol('')
    setPrice('')
    setDescription('')
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center
      justify-center bg-black bg-opacity-50 transform
      transition-transform duration-300 ${modal}`}
    >
      <div className="bg-[#151c25] shadow-xl shadow-[#e32970] rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold text-gray-400">Add NFT</p>
            <button
              type="button"
              onClick={closeModal}
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>

          <div className="flex flex-row justify-center items-center rounded-xl mt-5">
            <div className="shrink-0 rounded-xl overflow-hidden h-20 w-20">
              <img
                alt="NFT"
                className="h-full w-full object-cover cursor-pointer"
                src={
                  imgBase64 ||
                  'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1361&q=80'
                }
              />
            </div>
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <label className="block">
              <span className="sr-only">Choose profile photo</span>
              <input
                type="file"
                accept="image/png, image/gif, image/jpeg, image/webp"
                className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-[#19212c] file:text-gray-400
                hover:file:bg-[#1d2631]
                cursor-pointer focus:ring-0 focus:outline-none"
                onChange={onChange}
                required
              />
            </label>
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <input
              className="block w-full text-sm
              text-slate-500 bg-transparent border-0
              focus:outline-none focus:ring-0"
              type="text"
              name="name"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <input
              className="block w-full text-sm
              text-slate-500 bg-transparent border-0
              focus:outline-none focus:ring-0"
              type="text"
              name="symbol"
              placeholder="Symbol"
              onChange={(e) => setSymbol(e.target.value)}
              value={symbol}
              required
            />
          </div>
          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <input
              className="block w-full text-sm
              text-slate-500 bg-transparent border-0
              focus:outline-none focus:ring-0"
              type="number"
              step={0.01}
              min={0.01}
              name="price"
              placeholder="Price (ae)"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <textarea
              className="block w-full text-sm resize-none
              text-slate-500 bg-transparent border-0
              focus:outline-none focus:ring-0 h-20"
             // type="text"

              name="description"
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            //onclick={handleSubmit}
             onClick={()=>handleSubmit}
            className="flex flex-row justify-center items-center
            w-full text-white text-md bg-[#e32970]
            hover:bg-[#bd255f] py-2 px-5 rounded-full
            drop-shadow-xl border border-transparent
            hover:bg-transparent hover:text-[#e32970]
            hover:border hover:border-[#bd255f]
            focus:outline-none focus:ring mt-5"
          >
            Mint Now
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateNFT
