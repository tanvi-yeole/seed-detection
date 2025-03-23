import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="">
        <div className="min-h-[100dvh] bg-[#FFF6E7] w-full flex justify-between ps-24 gap-4 font-lexand">
          {/* Add 2 child divs for heading and image */}
          <div className="flex flex-col gap-4 mt-24">
            {/* Added flex-col so that we have paragraph below heading... Just added your content */}
            <h1 className="text-4xl md:text-8xl font-semibold text-[#392811]">
              Seed Quality Detection System
            </h1>
            <p className="text-xl md:text-[17px] w-[90%] text-[#392811] opacity-85">
              Our advanced seed quality detection system allows you to easily
              analyze the condition of your seeds and get valuable insights for
              growing a healthy crop. Simply take or scan an image of your
              seeds, and our technology will provide you with detailed
              information on temperature, soil type, moisture, pH, and
              germination rate
            </p>
            <Button size={"lg"}>
              <Link href={'/scan'}>
              Analyze Me
              </Link>
            </Button>
          </div>
          <div className="w-full">
            <img src="/img/img1.jpg" className="w-full" alt="" />
          </div>
        </div>
      </section>
      <section className="bg-[#f5f2ed]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto p-6 bg">
          <div className="card bg-[#E8DBCD] shadow-xl p-6">
            <h2 className="card-title text-2xl font-semibold">
              Explore Our Features
            </h2>
            <p className="text-base-content my-4">
              Our seed quality detection system is designed to revolutionize the
              way you approach crop cultivation. By providing comprehensive data
              on the key factors influencing seed health, we empower you to make
              informed decisions and maximize your yields. Discover the power of
              precision farming with our cutting-edge technology...
            </p>
            <Button>
              Get Started
            </Button>
          </div>

          <div className="card shadow-xl">
            <figure>
              <img
                src="/img/img2.png"
                alt="Sprouting seeds"
                className="rounded-lg"
              />
            </figure>
          </div>

          <div className="card bg-[#F4E8DC] shadow-xl p-6">
            <h2 className="card-title text-2xl font-semibold">
              Accurate Insights
            </h2>
            <p className="text-base-content my-4">
              With our advanced seed quality detection system, you'll receive
              detailed insights on the temperature, soil type, moisture, pH, and
              germination rate of your seeds. This data-driven approach ensures
              you have the information needed to create the optimal growing
              conditions for a thriving crop.
            </p>
            <Button>
              Learn More
            </Button>
          </div>

          <div className="bg-[#412D1D] text-neutral-content shadow-xl p-6">
            <h2 className="text-2xl font-semibold">
              Optimize Your Harvest
            </h2>
            <p className="my-4">
              By leveraging our seed quality detection technology, you can take
              the guesswork out of crop cultivation. Receive personalized
              recommendations on the ideal growing conditions, and watch your
              yields soar.
            </p>
            <p className="text-sm text-gray-300">Revolutionize Your Crops</p>
          </div>
        </div>
      </section>

      <section className="bg-[#FFF7F1] w-full px-24 py-28 font-lexand">
        <div className="flex flex-col gap-3">
          <div className="text-center">
            <h3 className="text-3xl font-semibold text-[#392811]">Comprehensive Seed Analysis</h3>
          </div>
          <div className="flex px-10 justify-between py-14" >
            <div className="flex flex-col gap-3 text-center">
              <img src="/img/Image 2.png " alt="" />
              <p className="text-base ">Soil Type</p>
            </div>
            <div className="flex flex-col gap-3 text-center">
              <img src="/img/Image 3.png " alt="" />
              <p className="text-base ">Temperature</p>
            </div>
            <div className="flex flex-col gap-3 text-center">
              <img src="/img/Image 4.png " alt="" />
              <p className="text-base ">Moisture</p>
            </div>
            <div className="flex flex-col gap-3 text-center">
              <img src="/img/Image 5.png " alt="" />
              <p className="text-base ">Germination Rate</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
