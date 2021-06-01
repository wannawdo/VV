<template>
  <div class="homepage">
    <div class="containerr">
      <header class="jumbotron">
        <h3>{{ content }}</h3>

        <h3 v-if="!loggedIn">Te rugăm să intri în cont pentru a continua.</h3>
      </header>
    </div>
    <!-- <img
      src="https://www.indianfolk.com/wp-content/uploads/2019/03/evoting_1200.jpg"
      alt="profile-sample4"
      class="vote"
    /> -->

    <div id="app">
      <div class="slider">
        <ul class="slides" :style="style">
          <li v-for="(slide, i) in playslides" :key="i">
            <div
              class="img"
              :style="{ backgroundImage: `url(${slide.img})` }"
            ></div>
          </li>
        </ul>
        <ul class="indicators">
          <li
            v-for="(slide, i) in slides"
            :key="i"
            @click="selectSlide(i)"
            :class="i == current ? 'active' : null"
          >
            <div class="item">
              <span class="title">{{ slide.title }}</span>
              <span class="progress">
                <div class="fill" :style="{ width: `${percent}%` }"></div>
                <div class="dot"></div>
              </span>
              <p class="mark">{{ slide.mark }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import UserService from "../services/user.service";

export default {
  name: "Home",
  data() {
    return {
      content: "",
      slides: [
        {
          img:
            "https://www.criticalstart.com/wp-content/uploads/2020/10/secure_vote_1200px.jpg__1200x630_q85_crop_subsampling-2_upscale-1024x538-1.jpg",
          title: "Give Your Home a Little Responsibility",
          mark: "Convenience",
        },
        {
          img:
            "https://www.topxlisting.com/blog/wp-content/uploads/2019/01/Ways-to-Get-Testimonials-From-Your-Customers.png",
          title: "Always Be In The Know",
          mark: "Monitoring & Safety",
        },
        {
          img:
            "https://www.calyron.com/admin/uploads/client-testimonials-768x432.jpg",
          title: "Smarter Home Security",
          mark: "Security",
        },
        {
          img:
            "https://kissflow.com/wp-content/uploads/2019/03/approval-process.jpg",
          title: "Experience Lighting in a New Way",
          mark: "Lighting",
        },
      ],
      current: 0,
      percent: 0,
      timer: 0,
      interval: 0,
      progress: 0,
      duration: 5000,
      playslides: [],
    };
  },
  computed: {
    style() {
      switch (this.current % 2) {
        case 0:
          return 0;
        case 1:
          return -100;
        default:
          return 0;
      }
    },
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  mounted() {
    UserService.getPublicContent().then(
      (response) => {
        this.content = response.data;
      },
      (error) => {
        this.content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
      }
    );
  },
  methods: {
    selectSlide(i) {
      this.current = i;
      this.playslides[this.current % 2] = this.slides[this.current];
      this.resetPlay();
    },
    process() {
      this.current++;
      if (this.current >= this.slides.length) {
        this.current = 0;
      }
      this.playslides[this.current % 2] = this.slides[this.current];
      this.resetPlay();
    },
    going() {
      let time = new Date().getTime();
      this.percent = Math.floor((100 * (time - this.timer)) / this.duration);
    },
    resetPlay() {
      clearInterval(this.interval);
      clearInterval(this.progress);
      this.play();
    },
    stop() {
      clearInterval(this.interval);
      clearInterval(this.progress);
    },
    play() {
      this.timer = new Date().getTime();
      this.progress = setInterval(this.going, this.duration / 100);
      this.interval = setInterval(this.process, this.duration);
    },
  },
  created() {
    this.playslides[0] = this.slides[0];
    this.playslides[1] = this.slides[1];
    this.play();
  },
};
document.body.style = "background: #f4f4f4";
</script>
<style scoped>
.containerr {
  width: 100%;
  height: 100%;
  margin-top: 5%;
  border-radius: 15%;
  background-color: #141414;
  box-shadow: 5px 10px 10px #011f4b;
  animation: zoominoutsinglefeatured 5s;
}
@keyframes zoominoutsinglefeatured {
  0% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1.1, 1.1);
  }
  100% {
    transform: scale(1, 1);
  }
}
.jumbotron {
  background-color: #b3cde0;
  border-radius: 25%;
  animation-name: example;
  animation-duration: 20s;
}
@keyframes example {
  0% {
    background-color: #b3cde0;
  }
  25% {
    background-color: #b3cde9;
  }
  50% {
    background-color: #b3dfff;
  }
  100% {
    background-color: #b3cde7;
  }
}
h3 {
  text-align: center;
  text-shadow: 1px 1px;
}

.vote {
  display: flex;
}

.slider {
  position: relative;
  margin: auto;
  z-index: 1;
  overflow: hidden;
  height: 500px;
  width: 1000px;
}
.app {
  height: 500px;
  widows: 1000px;
  background-color: #141414;
  margin: auto;
}
.slider ul {
  list-style: none;
}
.slider ul.slides {
  position: absolute;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  transition: top 800ms;
}
.slider ul.slides li {
  height: 100%;
}
.slider ul.slides li .img {
  height: 100%;
  background-size: cover;
  background-position: 50%;
}
.slider ul.indicators {
  position: absolute;
  padding-right: 40px;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  text-align: right;
}
.slider ul.indicators li {
  clear: both;
}
.slider ul.indicators li .item {
  position: relative;
  margin-bottom: 16px;
  float: right;
}
.slider ul.indicators li:last-child .item {
  margin-bottom: 0;
}
.slider ul.indicators li .title {
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  font-family: "SegoeUI-Bold";
  transition: font-size 0.6s ease-out;
}
.slider ul.indicators li .mark {
  font-family: "SegoeUI-Semilight";
}
.mark {
  background-color: rgba(0, 0, 0, 0.01);
}
.title {
  background-color: rgba(0, 0, 0, 0.01);
}

.slider ul.indicators li .dot {
  position: absolute;
  top: 50%;
  right: -20px;
  margin-top: -5.5px;
  margin-left: 10px;
  width: 11px;
  height: 11px;
  background: #fff;
  border-radius: 50%;
}

.slider ul.indicators li .progress {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 2px;
  margin: 8px 0;
  background: rgba(255, 255, 255, 0.5);
}
.slider ul.indicators li.active .title {
  transition: font-size 0.6s ease-in;
  font-size: 36px;
  font-family: "SegoeUI-Light";
}
.slider ul.indicators li.active .progress .fill {
  height: 100%;
  background: #fff;
}
.dot {
  position: absolute;
  top: 50%;
  right: -20px;
  margin-top: -5.5px;
  margin-left: 10px;
  width: 11px;
  height: 11px;
  background: #fff;
  border-radius: 50%;
}
.homepage {
  height: 100%;
  width: 100%;
}
</style>
