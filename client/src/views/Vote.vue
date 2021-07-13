<template>
  <div class="paginaVot">
    <div class="input-group mb-3">
      <input
        type="text"
        class="form-control"
        placeholder="Caută după nume"
        v-model="name"
      />
      <div class="input-group-append">
        <button
          class="btn btn-outline-secondary"
          type="button"
          @click="searchName"
        >
          Caută
        </button>
      </div>
    </div>
    <div class="dispFlex">
      <div class="col-md-6">
        <ul class="list-group">
          <li
            class="list-group-item"
            :class="{ active: index == currentIndex }"
            v-for="(session, index) in sessions"
            :key="index"
            @click="setActiveSession(session, index)"
          >
            {{ session.name }}
          </li>
        </ul>
      </div>
      <div class="col-md-6">
        <div class="col-md-6-1">
          <div v-if="currentSession">
            <h4>Sesiune selectata</h4>
            <div>
              <label><strong>Nume:</strong></label> {{ currentSession.name }}
            </div>
            <div class="form-group">
              <label for="name"><strong>Cod de acces</strong></label>
              <input
                v-model="accessCode"
                v-validate="'required|min:3|max:20'"
                type="text"
                class="form-control"
                name="name"
              />
            </div>
          </div>
          <div v-else>
            <br />
            <p class="select">Selectează o sesiune de vot...</p>
          </div>
          <div class="form-group-crearecont">
            <button
              class="btnn btn-primary btn-block"
              :disabled="loading"
              @click="accessSession()"
            >
              <span
                v-show="loading"
                class="spinner-border spinner-border-sm"
              ></span>
              <span><strong>Acceseaza sesiunea</strong></span>
            </button>
          </div>
        </div>
      </div>

      <div class="poll-view" v-if="loadedSession">
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
              <span class="percent"
                >{{ calculatePercent(answer.votes) }}%
              </span>
              <span class="votes">({{ answer.votes }} voturi)</span>
            </div>
            <div class="bar">
              <div
                :style="{ width: calculatePercent(answer.votes) + '%' }"
              ></div>
            </div>
          </div>
        </div>
        <div v-if="demo" class="poll-view__footer">
          Made with &hearts; by
          <a href="https://updivision.com/">updivision.com</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import VoteService from "../services/vote-sessions.service";
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
        question: "",
        answers: [
          // { id: 1, answer: "Da", votes: 14021 },
          // { id: 2, answer: "Nu", votes: 3210 },
          // { id: 3, answer: "Abținere", votes: 3231 },
        ],
        multipleVotes: false,
        selectedAnswer: "",
      },
      totalVotes: 0,
      result: false,
      success: null,
      isValid: false,
      votes: [],
      sessions: [],
      currentSession: null,
      currentIndex: -1,
      loading: false,
      name: "",
      accessCode: "",
      loadedSession: false,
    };
  },
  mounted() {
    this.retrieveSessions();
    // axios
    //   .get(this.getPollUrl, {
    //     maxContentLength: 2000,
    //   })
    //   .then((response) => {
    //     this.poll = response;
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     error.request.res.destroy();
    //   });
  },
  methods: {
    accessSession() {
      VoteService.get(this.currentSession.id, this.accessCode).then(
        (response) => {
          this.totalVotes = 0;
          this.poll.id = this.currentSession.id;
          this.poll.question = response.data.description;
          this.poll.answers = [];
          let i = 0;
          response.data.options.forEach((option) => {
            let tempCount = 0;
            response.data.votes.forEach((vote) => {
              if (vote.option == i) tempCount++;
            });
            this.poll.answers.push({
              id: i,
              answer: option,
              votes: tempCount,
            });
            i++;
          });
          this.loadedSession = true;
          this.result = response.data.userHasVoted;
          if (response.data.userHasVoted) this.calculateTotalVotes();
        }
      );
    },
    setActiveSession(session, index) {
      this.loadedSession = false;
      this.accessCode = "";
      this.currentSession = { ...session };
      this.currentIndex = index;
    },
    retrieveSessions() {
      VoteService.getAll()
        .then((response) => {
          this.sessions = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    vote() {
      this.validate();
      // demo only ------
      if (this.demo && this.isValid) {
        this.alert(true);
        this.calculateTotalVotes();
      } else {
        // --------------
        if (this.isValid) {
          this.poll.answers.forEach((answer) => {
            if (answer.voted) {
              this.poll.selectedAnswer = answer.id;
              answer.votes++;
            }
          });
          axios
            .post(
              "http://" + window.location.hostname + ":8080/vot",
              {
                sessionId: this.poll.id,
                option: this.poll.selectedAnswer,
                accessCode: this.accessCode,
                accessToken: JSON.parse(window.localStorage.getItem("user"))
                  .accessToken,
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
    multipleCheck() {
      if (this.poll.multipleVotes == true) {
        return;
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
      });
    },
    searchName() {
      VoteService.findByTitle(this.name)
        .then((response) => {
          this.sessions = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>
<style scoped>
.input-group {
  margin: 0%;
  border-radius: 25px;
  padding: 1%;
}
.dispFlex {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.paginaSesiuni {
  min-width: 400px;
}
.alegeSesiune {
  min-width: 600px;
}
.list {
  text-align: left;

  margin: auto;
  margin-top: 3%;
  margin-bottom: 5%;
}

.col-md-6-1 {
  margin-top: 5%;
  margin-left: 5%;
  border-radius: 25px;
  border: 2px solid #011f4b;
  padding: 5%;
  background-color: #b3cde0;
}
.col-md-6 {
  max-width: 33%;
}

.list-group {
  border-radius: 25px;
  border: 2px solid #011f4b;
}
select {
  text-align: center;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}
.btn-primary {
  border-radius: 25px;
  border: 2px solid #011f4b;
  padding: 20px;
  background-color: #011f4b;
  margin-top: 5%;
}
span {
  text-color: white;
}
.input-group {
  margin: 0%;
  border-radius: 25px;
  padding: 1%;
}
.butoane {
  border-radius: 25px;
  border: 2px solid #011f4b;
  padding: 3%;
  margin: auto;
  margin-left: 5%;
  margin-top: 10%;
  background-color: #b3cde0;
}
.btnn {
  padding: 1%;
  margin-top: 2%;
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
.jumbotronn {
  animation: zoominoutsinglefeatured 7s;
  border-radius: 25px;
  border: 2px solid #011f4b;
  margin-top: 5%;
  background-color: #b3cde0;
  box-shadow: 5px 5px 10px #011f4b;
}
.info {
  text-align: center;
  height: 50px;
  margin-top: 20px;
  text-shadow: 1px 1px;
}
</style>
