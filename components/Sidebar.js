import React from 'react';
import TwitterIcon from '@mui/icons-material/Twitter';
import SidebarLinks from './SidebarLinks';
import { HomeIcon } from "@heroicons/react/solid";
import { useSession, signOut } from "next-auth/react";
import {
  HashtagIcon,
  BellIcon,
  InboxIcon,
  BookmarkIcon,
  ClipboardListIcon,
  UserIcon,
  DotsCircleHorizontalIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/outline";
import { useRouter } from 'next/router';

function Sidebar() {
  const { data: session } = useSession()
  const router = useRouter()
  return <div className='hidden sm:flex flex-col xl:items-start xl:w-[340px] p-2 fixed h-full'>
            <div className="flex items-center sticky justify-center w-14 h-14 hoverAnimation p-0 xl:ml-24"
            onClick={() => router.push('/')}>
                <TwitterIcon className='text-white w-9 h-9' />        
            </div>
            <div className="space-y-2.5 mt-4 mb-2.5 xl:ml-24">
            <SidebarLinks text="Home" Icon={HomeIcon} active />
            <SidebarLinks text="Explore" Icon={HashtagIcon} />
            <SidebarLinks text="Notifications" Icon={BellIcon} />
            <SidebarLinks text="Messages" Icon={InboxIcon} />
            <SidebarLinks text="Bookmarks" Icon={BookmarkIcon} />
            <SidebarLinks text="Lists" Icon={ClipboardListIcon} />
            <SidebarLinks text="Profile" Icon={UserIcon} />
            <SidebarLinks text="More" Icon={DotsCircleHorizontalIcon} />
            </div>
            <button className="hidden xl:inline ml-auto bg-[#1d9bf0] text-white rounded-full w-56 h-[52px] text-lg font-bold  hover:bg-[#1a8cd8]">
              Tweet
            </button>
            <div
            className="text-[#d9d9d9]  flex items-center justify-center hoverAnimation xl:ml-auto xl:-mr-1.5 mt-auto"
            onClick={signOut}
            >
                <img
                src={session.user.image}
                alt=""
                className="h-10 w-10 rounded-full xl:mr-3"
                />
                <div className="hidden xl:inline">
                    <h4 className="font-bold">{session.user.name}</h4>
                    <p className="text-[#6e767d]">@{session.user.tag}</p>
                </div>
                <DotsHorizontalIcon className="h-5 hidden xl:inline ml-10" />
            </div>
        </div>;
}

export default Sidebar;
