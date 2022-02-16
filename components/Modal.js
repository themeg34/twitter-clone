import React from 'react'
import { snapshot_UNSTABLE, useRecoilState } from "recoil";
import { modalState, postIdState } from "../atoms/modalAtom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { Picker } from 'emoji-mart'
import {
  onSnapshot,
  doc,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc
} from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { db } from "../firebase";
import { storage } from '../firebase';
import { useSession } from "next-auth/react";
import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import Moment from "react-moment";

function Modal() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [post, setPost] = useState();
  const [comment, setComment] = useState("");
  const router = useRouter();
  const filePickerRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null);
  const [ShowEmojis, setShowEmojis] = useState(false);
  



  useEffect(
    () =>
      onSnapshot(doc(db, "posts", postId), (snapshot) => {
        setPost(snapshot.data());
      }),
    [db]
  );
  const sendComment = async(e) => {
    e.preventDefault()

    const commentRef = await addDoc(collection(db, 'posts', postId, 'comments'), {
      id: session.user.uid,
      comment: comment,
      username: session.user.name,
      tag: session.user.tag,
      userImg: session.user.image,
      timestamp: serverTimestamp()
    })

    const imageRef = ref(storage, `posts/${commentRef.id}/image`);
    
        if (selectedFile) {
          await uploadString(imageRef, selectedFile, "data_url").then(async () => {
            const downloadURL = await getDownloadURL(imageRef);
            await updateDoc(doc(db, "posts", postId, 'comments', commentRef.id), {
              image: downloadURL,
            });
          });
    }
    setSelectedFile(null)
    setIsOpen(false)
    setComment('')

    router.push(`/${postId}`)

  }
  const addImagetoPost = (e) => {
    const reader = new FileReader()
    if(e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0])
    }
    reader.onload = (readerEvent) => {
        setSelectedFile(readerEvent.target.result)
    }
  }
  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setComment(comment + emoji);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed z-50 inset-0 pt-8" onClose={setIsOpen}>
        <div className="flex items-start justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-[#5b7083] bg-opacity-40 transition-opacity" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-black rounded-2xl text-left overflow-y-scroll scrollbar-hide shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
                <div className='flex items-center px-1.5 py-2 border-b border-gray-700'>
                    <div className='hoverAnimation flex h-9 w-9 justify-center items-center xl:px-0' onClick={() => setIsOpen(false)}>
                        <XIcon className='text-white h-5' />
                    </div>
                </div>
                <div className="flex px-4 pt-5 pb-2.5 sm:px-6">
                <div className="w-full">
                  <div className="text-[#6e767d] flex gap-x-3 relative">
                    <span className="w-0.5 h-full z-[-1] absolute left-5 top-11 bg-gray-600" />
                    <img
                      src={post?.userImg}
                      alt=""
                      className="h-11 w-11 rounded-full"
                    />
                    <div>
                      <div className="inline-block group">
                        <h4 className="font-bold text-[#d9d9d9] inline-block text-[15px] sm:text-base">
                          {post?.username}
                        </h4>
                        <span className="ml-1.5 text-sm sm:text-[15px]">
                          @{post?.tag}{" "}
                        </span>
                      </div>{" "}
                      ·{" "}
                      <span className="hover:underline text-sm sm:text-[15px]">
                        <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
                      </span>
                      <p className="text-[#d9d9d9] text-[15px] sm:text-base">
                        {post?.text}
                      </p>
                      <img src={post?.image} className="rounded-2xl max-w-[300px] mt-2" />
                    </div>
                  </div>
                  <div className='mt-7 flex space-x-3 w-full overflow-y-scroll scrollbar-hide'>
                    <img src={session?.user.image} className="h-11 w-11 rounded-full"/>
                    <div className='flex-grow mt-2'>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tweet your reply"
                        rows="2"
                        className="bg-transparent scrollbar-hide outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide w-full min-h-[80px]"
                      />
                      {selectedFile && (
                      <div className="relative">
                        <div
                        className="absolute w-8 h-8 bg-[#15181c]
                      hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
                        onClick={() => setSelectedFile(null)}>
                            <XIcon className='text-white h-5'/>
                        </div>
                        <img src={selectedFile} alt='' className='rounded-2xl max-h-40 object-contain' />
                      </div>
            )}
                      <div className='flex items-center justify-between pt-2.5 mb-2'>
                        <div className="flex items-center">
                          <div className="icon" onClick={() => filePickerRef.current.click()}>
                            <PhotographIcon className="text-[#1d9bf0] h-[22px]" />
                            <input type='file' hidden onChange={addImagetoPost} ref={filePickerRef} />
                          </div>
                          <div className="icon"  onClick={() => setShowEmojis(!ShowEmojis)}>
                            <EmojiHappyIcon className="text-[#1d9bf0] h-[22px]" />
                          </div>
                          {ShowEmojis && (
                          <Picker
                          onSelect={addEmoji}
                          style={{
                          position: "absolute",
                          marginTop: "-465px",
                          marginLeft: -10,
                          maxWidth: "320px",
                          borderRadius: "20px",
                          }}
                          theme="dark"
                          className="scrollbar-hide"
                          />
                          )}
                        </div>
                        <button
                          className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
                          type="submit"
                          disabled={!comment.trim()}
                          onClick={sendComment}
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </Transition.Child>
      </div>
    </Dialog>
</Transition.Root>
                    
  );
}

export default Modal;