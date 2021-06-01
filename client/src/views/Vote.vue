<template>
  <div class="poll-view">
    <div class="poll-view__title" v-html="poll.question"></div>
    <div v-if="!result" class="poll-view__inner">
      <div class="poll-view__help">
        <span v-if="poll.multipleVotes">Alege mai multe răspunsuri:</span>
        <span v-else>Alege un singur răspuns:</span>
      </div>
      <div class="poll-view__votes">
        <div
          v-for="(answer, index) in poll.answers"
          :key="answer.id"
          class="answer"
        >
          <label class="checkbox"
            >{{ answer.answer }}
            <input
              type="checkbox"
              v-model="poll.answers[index].voted"
              @change="multipleCheck(index)"
            />
            <span class="checkmark"></span>
          </label>
        </div>
      </div>
      <div class="poll-view__submit">
        <button @click="vote">Votează</button>
      </div>
      <div
        class="poll-view__info"
        :class="{ success: success === true, error: success === false }"
        v-if="success !== null"
      >
        <div v-if="success === true">Felicitări! Ai votat!</div>
        <div v-if="success === false">
          Eroare! Votul nu a putut fi înregistrat!
        </div>
      </div>
    </div>
    <div v-if="result" class="poll-view__results">
      <div
        class="result"
        v-for="(answer, index) in this.poll.answers"
        :key="index"
      >
        <div class="title">
          {{ answer.answer }}
          <span class="percent">{{ calculatePercent(answer.votes) }}% </span>
          <span class="votes">({{ answer.votes }} voturi)</span>
        </div>
        <div class="bar">
          <div :style="{ width: calculatePercent(answer.votes) + '%' }"></div>
        </div>
      </div>
    </div>
    <div v-if="demo" class="poll-view__footer">
      Made with &hearts; by
      <a href="https://updivision.com/">updivision.com</a>
    </div>
  </div>
</template>
<script>
import axios from "axios";

import "./assets/vue-easy-polls.css";
export default {
  name: "poll-view",
  props: {
    saveVoteUrl: {
      type: String,
    },
    getPollUrl: {
      type: String,
    },
    demo: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      poll: {
        id: 1,
        question: "Validezi <strong>președintele</strong> ?",
        answers: [
          { id: 1, answer: "Da", votes: 14021 },
          { id: 2, answer: "Nu", votes: 3210 },
          { id: 3, answer: "Abținere", votes: 3231 },
        ],
        multipleVotes: true,
      },
      totalVotes: 0,
      result: false,
      success: null,
      isValid: false,
      votes: [],
    };
  },
  mounted() {
    axios
      .get(this.getPollUrl, {
        maxContentLength: 2000,
      })
      .then((response) => {
        this.poll = response;
      })
      .catch((error) => {
        console.log(error);
        error.request.res.destroy();
      });
  },
  methods: {
    vote() {
      this.validate();
      // demo only ------
      if (this.demo && this.isValid) {
        this.alert(true);
        this.calculateTotalVotes();
      } else {
        // --------------
        if (this.isValid) {
          axios
            .post(
              this.saveVoteUrl,
              {
                pollId: this.poll.id,
                votes: this.votes,
              },
              {
                maxContentLength: 2000,
              }
            )
            .then((response) => {
              console.log(response);
              this.calculateTotalVotes();
              this.alert(true);
            })
            .catch((error) => {
              this.alert(false);
              error.request.res.destroy();
            });
        } else {
          this.alert(false);
        }
      }
    },
    multipleCheck(index) {
      if (this.poll.multipleVotes == true) {
        return;
      } else {
        const nrOfVotes = this.poll.answers.filter((ans) => ans.voted == true)
          .length;
        if (nrOfVotes > 1) {
          this.poll.answers[index].voted = false;
        }
      }
    },
    validate() {
      const votes = this.poll.answers
        .filter((answer) => answer.voted == true)
        .map((answer) => answer.id).length;
      if (votes > 0) {
        if (votes > 1) {
          if (this.poll.multipleVotes == true) {
            this.isValid = true;
          } else {
            this.isValid = false;
          }
        } else {
          this.isValid = true;
        }
      } else {
        this.isValid = false;
      }
    },
    alert(success) {
      this.success = success;
      setTimeout(() => {
        this.success = null;
        this.result = success;
      }, 1500);
    },
    calculatePercent(votes) {
      return parseInt((10000 * votes) / this.totalVotes) / 100;
    },
    calculateTotalVotes() {
      this.poll.answers.forEach((answer) => {
        this.totalVotes += answer.votes;
        if (answer.voted) {
          this.totalVotes += 1;
        }
      });
    },
  },
};
</script>
