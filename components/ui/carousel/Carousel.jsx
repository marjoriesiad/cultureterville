'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const Carousel = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        loop
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        className="rounded-xl overflow-hidden"
      >
        <SwiperSlide>
          <div className="h-48 flex items-center justify-center bg-primary text-background text-xl font-semibold">
            1
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="h-48 flex items-center justify-center bg-highlight text-text text-xl font-semibold">
           2
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="h-48 flex items-center justify-center bg-text text-background text-xl font-semibold">
            3
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Carousel;
