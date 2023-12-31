"use client";

import Backdrop from "@/app/_components/Backdrop";
import BookmarkedPost from "@/app/_components/BookmarkedPost";
import BookmarkedProject from "@/app/_components/BookmarkedProject";
import Loader from "@/app/_components/Loader";
import { getBookmarks } from "@/app/libs/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LuXCircle } from "react-icons/lu";

const Bookmarks = () => {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session?.user) {
    router.push("/");
  }

  const [tabValue, setTabValue] = useState("post");

  const { data, error, isLoading } = useQuery({
    queryKey: ["bookmark", tabValue],
    queryFn: () => getBookmarks(tabValue),
  });

  // const queryClient = useQueryClient();
  // // Mutations
  // const {
  //   mutate: _getBookMarks,
  //   isError: _getBookMarksHasError,
  //   isPending: _getBookMarksIsPending,
  // } = useMutation({
  //   mutationFn: (type: any) => getBookmarks(type),
  //   onSuccess: () => {
  //     // Invalidate and refetch
  //     queryClient.invalidateQueries({ queryKey: ["team"] });
  //   },
  // });

  // if (_getBookMarksHasError) return <div>Something went wrong. Please try it again later</div>;

  // const onChangeTab = (val: any) => {
  //   setTabValue(val);
  // };

  console.log("data: ", data);

  return (
    <div className="bg-[#F5F5F5] w-full min-h-screen max-h-full pt-6 pb-9">
      <div className="mx-auto max-w-6xl">
        <Tabs
          onValueChange={(val) => setTabValue(val)}
          defaultValue={tabValue}
          className="w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="post">Post</TabsTrigger>
            <TabsTrigger value="project">Project</TabsTrigger>
          </TabsList>
          <TabsContent value="post">
            <div className="my-2 w-[700px] bg-white shadow-md p-4 rounded-lg border-zinc-100 border-[1px]">
              {isLoading ? (
                // <Loader className="mx-auto w-8 h-8 animate-spin" />
                <Backdrop />
              ) : data?.response?.length === 0 ? (
                <div className="text-muted-foreground relative min-h-[80px]">
                  <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex gap-2  items-center ">
                    <LuXCircle className="w-5 h-5" />
                    <span className="">No Data</span>
                  </div>
                </div>
              ) : (
                data?.response?.map((post: any) => (
                  <div
                    key={post.id}
                    //   className="flex gap-3 mb-3 items-center bg-white shadow-md p-3 rounded-lg border-zinc-100 border-[1px]"
                    className={`${data?.response?.length > 0 && "mb-3"}`}
                  >
                    <BookmarkedPost key={post.id} post={post} />
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          <TabsContent value="project">
            <div className="my-2 w-[700px] bg-white shadow-md p-4 rounded-lg border-zinc-100 border-[1px]">
              {isLoading ? (
                // <Loader className="mx-auto w-8 h-8 animate-spin" />
                <Backdrop />
              ) : data?.response?.length === 0 ? (
                <div className="text-muted-foreground relative min-h-[80px]">
                  <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex gap-2  items-center ">
                    <LuXCircle className="w-5 h-5" />
                    <span className="">No Data</span>
                  </div>
                </div>
              ) : (
                data?.response?.map((bookmarked: any) => (
                  <div
                    key={bookmarked.id}
                    //   className="flex gap-3 mb-3 items-center bg-white shadow-md p-3 rounded-lg border-zinc-100 border-[1px]"
                    className={`${data?.response?.length > 0 && "mb-3"}`}
                  >
                    <BookmarkedProject key={bookmarked.id} project={bookmarked} />
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Bookmarks;
