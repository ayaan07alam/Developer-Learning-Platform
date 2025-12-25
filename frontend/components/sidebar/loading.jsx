import "@/app/globals.css";
import { Skeleton, SVGSkeleton } from "./Skeleton";

const LoadingSkeleton = () => (
  <>
    <div className="top-0 hidden sm:block sm:col-span-2 h-screen overflow-y-scroll">
      <div>
        <div className="flex flex-col space-y-6 w-full mb-8">
          <div className="py-2 px-2 top-0 z-30">
            <div>
              <Skeleton className="w-[120px] max-w-full" />
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center p-2 justify-between">
              <div className="flex items-center space-x-2">
                <p>
                  <Skeleton className="w-[88px] max-w-full" />
                </p>
              </div>
            </div>
            <div className="flex items-center p-2 justify-between">
              <div className="flex items-center space-x-2">
                <p>
                  <Skeleton className="w-[96px] max-w-full" />
                </p>
              </div>
            </div>
            <div className="flex items-center p-2 justify-between">
              <div className="flex items-center space-x-2">
                <p>
                  <Skeleton className="w-[144px] max-w-full" />
                </p>
              </div>
            </div>
            <div className="flex items-center p-2 justify-between">
              <div className="flex items-center space-x-2">
                <p>
                  <Skeleton className="w-[112px] max-w-full" />
                </p>
              </div>
            </div>
            <div className="flex items-center p-2 justify-between">
              <div className="flex items-center space-x-2">
                <p>
                  <Skeleton className="w-[80px] max-w-full" />
                </p>
              </div>
              <SVGSkeleton className="w-[18px] h-[18px]" />
            </div>
            <div className="flex items-center p-2 justify-between">
              <div className="flex items-center space-x-2">
                <p>
                  <Skeleton className="w-[144px] max-w-full" />
                </p>
              </div>
            </div>
            <div className="flex items-center p-2 justify-between">
              <div className="flex items-center space-x-2">
                <p>
                  <Skeleton className="w-[80px] max-w-full" />
                </p>
              </div>
            </div>
            <div className="flex items-center p-2 justify-between">
              <div className="flex items-center space-x-2">
                <p>
                  <Skeleton className="w-[136px] max-w-full" />
                </p>
              </div>
            </div>
            <div className="flex items-center p-2 justify-between">
              <div className="flex items-center space-x-2">
                <p>
                  <Skeleton className="w-[96px] max-w-full" />
                </p>
              </div>
            </div>
            <div className="flex items-center p-2 justify-between">
              <div className="flex items-center space-x-2">
                <p>
                  <Skeleton className="w-[104px] max-w-full" />
                </p>
              </div>
            </div>
            <div className="flex items-center p-2 justify-between">
              <div className="flex items-center space-x-2">
                <p>
                  <Skeleton className="w-[152px] max-w-full" />
                </p>
              </div>
            </div>
            <div className="flex items-center p-2 justify-between">
              <div className="flex items-center space-x-2">
                <p>
                  <Skeleton className="w-[96px] max-w-full" />
                </p>
              </div>
            </div>
            <div className="flex items-center p-2 justify-between">
              <div className="flex items-center space-x-2">
                <p>
                  <Skeleton className="w-[96px] max-w-full" />
                </p>
              </div>
            </div>
            <div className="flex items-center p-2 justify-between">
              <div className="flex items-center space-x-2">
                <p>
                  <Skeleton className="w-[104px] max-w-full" />
                </p>
              </div>
            </div>
            <div className="flex items-center p-2 justify-between">
              <div className="flex items-center space-x-2">
                <p>
                  <Skeleton className="w-[88px] max-w-full" />
                </p>
              </div>
            </div>
            <div className="flex items-center p-2 justify-between">
              <div className="flex items-center space-x-2">
                <p>
                  <Skeleton className="w-[144px] max-w-full" />
                </p>
              </div>
            </div>
            <div className="flex items-center p-2 justify-between">
              <div className="flex items-center space-x-2">
                <p>
                  <Skeleton className="w-[152px] max-w-full" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

const SandboxPreview = () => (
  <div className="flex justify-center w-full h-full p-10">
    <LoadingSkeleton />
  </div>
);

export default SandboxPreview;
