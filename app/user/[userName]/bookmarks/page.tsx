"use client";

import Loader from "@/app/_components/Loader";
import { getBookmarks } from "@/app/libs/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
            {/* <div className="my-2 w-[700px] bg-white shadow-md p-4 rounded-lg border-zinc-100 border-[1px]">
              {isLoading ? (
                <Loader className="mx-auto w-8 h-8 animate-spin" />
              ) : (
                data?.response?.map((post: any) => <div></div>)
              )}
            </div> */}
          </TabsContent>
          <TabsContent value="project">
            <div className="my-2 w-[700px] bg-white shadow-md p-4 rounded-lg border-zinc-100 border-[1px]">
              {/* {isLoading ? (
                <Loader className="mx-auto w-8 h-8 animate-spin" />
              ) : (
                data?.response?.map((project: any) => <div></div>)
              )} */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Bookmarks;
