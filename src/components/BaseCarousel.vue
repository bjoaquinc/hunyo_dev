<template>
  <div>
    <q-responsive :ratio="1">
      <div
        class="overflow-hidden"
        ref="container"
        style="position: relative; border: 1px solid rgba(0, 0, 0, 0.12)"
      >
        <div class="gt-xs">
          <q-btn
            v-if="currentIndex > 0"
            @click="setPositionByIndex(currentIndex - 1)"
            class="absolute-center"
            color="white"
            text-color="black"
            icon="fas fa-chevron-left"
            style="left: 5%; opacity: 0.5; z-index: 100"
            fab-mini
          />
          <q-btn
            v-if="currentIndex !== slides.length - 1"
            @click="setPositionByIndex(currentIndex + 1)"
            class="absolute-center"
            color="white"
            text-color="black"
            icon="fas fa-chevron-right"
            style="left: 95%; opacity: 0.5; z-index: 100"
            fab-mini
          />
        </div>
        <div
          :style="{
            width: `${100 * slides.length}%`,
            height: 'inherit',
            transform: `translateX(${currentTranslate}px)`,
            transition: `transform ${easeOut}s ease-out`,
          }"
          class="slide-container"
        >
          <div
            v-for="(image, index) in slides"
            :key="index"
            v-touch-pan.horizontal.prevent.mouse="handlePan"
            @touchstart="findIndex(index)"
            @mousedown="findIndex(index)"
            class="slide"
            :prevent="true"
            :style="{ minWidth: `${100 / slides.length}%` }"
          >
            <q-img :src="image" :ratio="1" img-class="slide-img" />
          </div>
        </div>
      </div>
    </q-responsive>
    <div class="flex justify-center" v-if="imagesList.length > 1">
      <q-btn
        v-for="(slide, index) in slides"
        :key="index"
        :icon="currentIndex === index ? 'fas fa-circle' : 'far fa-circle'"
        @click="setPositionByIndex(index)"
        color="primary"
        size="6px"
        flat
        round
      />
    </div>
  </div>
</template>

<script>
import amplitude from "amplitude-js";

export default {
  props: [
    "imagesList",
    "postId",
    "location",
    "userId",
    "topics",
    "numUserReads",
  ],
  data() {
    return {
      imageWidth: 0,
      easeOut: 0.3,
      info: null,
      panning: false,
      startPosition: 0,
      currentPosition: 0,
      currentTranslate: 0,
      previousTranslate: 0,
      movedBy: 0,
      animationId: 0,
      currentIndex: 0,
      newTranslate: 0,
    };
  },
  computed: {
    slides() {
      if (this.imagesList) {
        return this.imagesList;
      } else {
        return [
          "https://placeimg.com/500/300/nature",
          "sample.jpeg",
          "https://placeimg.com/500/300/nature",
        ];
      }
    },
    currentUserId() {
      return this.$store.getters["auth/getUser"]
        ? this.$store.getters["auth/getUser"].uid
        : null;
    },
  },
  methods: {
    handlePan({ evt, ...newInfo }) {
      this.info = newInfo;
      // native Javascript event
      // console.log(evt)

      if (newInfo.isFirst) {
        this.panning = true;
        this.startPosition = newInfo.position.left;
        this.animationId = requestAnimationFrame(this.animation);
      } else if (newInfo.isFinal) {
        this.panning = false;
        this.easeOut = 0.3;

        cancelAnimationFrame(this.animationId);

        const movedBy = newInfo.offset.x;

        if (movedBy < -100 && this.currentIndex < this.slides.length - 1) {
          this.sendSwipeEvent("right");
          this.currentIndex += 1;
        }
        if (movedBy > 100 && this.currentIndex > 0) {
          this.sendSwipeEvent("left");
          this.currentIndex -= 1;
        }

        this.setPositionByIndex();
      }

      this.currentPosition = newInfo.position.left;
    },
    touchMove() {
      if (this.panning) {
        this.easeOut = 0;
        this.currentTranslate =
          this.previousTranslate + this.currentPosition - this.startPosition;
      }
    },
    animation() {
      this.touchMove();
      if (this.panning) requestAnimationFrame(this.animation);
    },
    findIndex(index) {
      this.currentIndex = index;
    },
    setPositionByIndex(index) {
      if (index > this.currentIndex) {
        this.sendSwipeEvent("right");
      } else if (index < this.currentIndex) {
        this.sendSwipeEvent("left");
      }
      if (index || index === 0) this.currentIndex = index;
      this.currentTranslate = this.currentIndex * -this.imageWidth;
      this.previousTranslate = this.currentTranslate;
      this.touchMove();
    },
    sendSwipeEvent(direction) {
      try {
        if (!this.currentUserId) return;
        if (!this.userId || this.userId === this.currentUserId) return;
        const followingList =
          this.$store.getters["subscriptions/getFollowingList"];
        amplitude.getInstance().logEventWithTimestamp("save - swipe photo", {
          "post id": this.postId,
          topics: this.topics,
          location: this.location,
          direction,
          "num total views": this.numUserReads ? this.numUserReads : null,
          "author user id": this.userId,
          "is subscribe": followingList.includes(this.userId),
        });
        // console.log("Successfully sent swipe photo event");
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    if (this.$q.platform.is.desktop || this.$q.platform.is.ipad) {
      this.imageWidth = this.$refs.container.clientWidth;
    } else {
      this.imageWidth = this.$refs.container.clientWidth;
    }
  },
};
</script>

<style lang="sass" scoped>

.slide-container
  height: 60%
  overflow: hidden
  display: inline-flex
  cursor: grab

.slide
  max-height: 100vh
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  user-select: none


.slide-img
    max-height: 60%

.grabbing
  cursor: grabbing
</style>
