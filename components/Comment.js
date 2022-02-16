import React from "react";
import {
    BookmarkIcon,
    ChatIcon,
    DotsHorizontalIcon,
    HeartIcon,
    ShareIcon,
    TrashIcon,
    HeartIconFilled,
    SwitchHorizontalIcon
  } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import Moment from "react-moment";
import { db } from "../firebase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    setDoc,
} from "@firebase/firestore";


  function Comment({ comment, id }) {
      const { data: session } = useSession()
      const router = useRouter()
      const idPost = router.query.id
      const [likes1, setLikes1] = useState([])
      const [liked1, setLiked1] = useState(false)


      useEffect(
        () =>
        onSnapshot(collection(db, 'posts', idPost, 'comments', id, 'likes'),
        (snapshot) => 
        setLikes1(snapshot.docs)), 
        [db, idPost] )

        useEffect(
            () =>
            setLiked1(
                likes1.findIndex((like1) => like1.id === session?.user?.uid) !== -1
            ),
            [likes1]
        );
    
    const likePost1 = async () => {
        if (liked1) {
            await deleteDoc(doc(db, "posts", idPost, "comments", id, "likes", session.user.uid));
        } else {
            await setDoc(doc(db, "posts", idPost, 'comments', id, "likes", session.user.uid), {
                username: session.user.name,
            });
        }
    };

      
    return (
    <div className="p-3 flex cursor-pointer border-b border-gray-700">
        <img
          src={comment?.userImg}
          alt=""
          className="h-11 w-11 rounded-full mr-4"
        />
        <div className="flex flex-col space-y-2 w-full">
            <div className="flex justify-between">
                <div className="text-[#6e767d]">
                    <div className="inline-block group">
                        <h4 className="font-bold text-[#d9d9d9] text-[15px] sm:text-base inline-block group-hover:underline">
                            {comment?.username}
                        </h4>
                        <span className="ml-1.5 text-sm sm:text-[15px]">
                            @{comment?.tag}{" "}
                        </span>
                    </div>{" "}
                ·{" "} 
                <span className="hover:underline text-sm sm:text-[15px]">
                    <Moment fromNow>{comment?.timestamp?.toDate()}</Moment>
                </span>
                <p className="text-[#d9d9d9] mt-0.5 max-w-lg overflow-scroll scrollbar-hide text-[15px] sm:text-base">
                    {comment?.comment}
                </p> 
                <img src={comment?.image} alt="" className='mt-5 rounded-2xl' />
                </div>
                
                <div className="icon group flex-shrink-0">
                    <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
                </div>
            </div> 
            <div className="text-[#6e767d] flex justify-between w-10/12">
                <div className="icon group">
                    <ChatIcon className="h-5 group-hover:text-[#1d9bf0]" />
                </div>
                <div className="flex items-center space-x-1 group">
            <div className="icon group-hover:bg-pink-600/10">
              <HeartIcon className="h-5 group-hover:text-pink-600" />
            </div>
            <span className="group-hover:text-pink-600 text-sm"></span>
          </div>
                
                
                {session.user.uid === comment?.id && (
                    <div
                        className="flex items-center space-x-1 group"
                        onClick={() => {
                        deleteDoc(doc(db, 'posts', idPost, 'comments', id));
                }}
                    >
                        <div className="icon group-hover:bg-red-600/10">
                            <TrashIcon className="h-5 group-hover:text-red-600" />
                        </div>
                    </div>
                )}

                <div className="icon group">
                    <ShareIcon className="h-5 group-hover:text-[#1d9bf0]" />
                </div>
                <div className="icon group">
                    <BookmarkIcon className="h-5 group-hover:text-[#1d9bf0]" />
                </div>

            </div>     
        </div>
    </div>
    );
  }
  
  export default Comment;