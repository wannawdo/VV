<template>
  <!-- <footer id="footer">
    <div class="container">
      <p>@Copyright Dragomirescu Oana 2021</p>
    </div>
    <div class="social">
      <a href="https://www.facebook.com/sisc.ase/" target="_blank">
        <img src="https://i.imgur.com/qPFEsdE.png" height="20" width="20" />
      </a>

      <a href="https://www.instagram.com/sisc.ase/" target="_blank">
        <img src="https://i.imgur.com/4q9IcLX.png" height="20" width="20" />
      </a>
    </div>
  </footer> -->
  <div class="card-footer ">
    <div class="container-footer">
      <p>@Copyright Dragomirescu Oana 2021</p>
    </div>
    <div class="social">
      <a href="https://www.facebook.com/sisc.ase/" target="_blank">
        <img src="https://i.imgur.com/qPFEsdE.png" height="20" width="20" />
      </a>

      <a href="https://www.instagram.com/sisc.ase/" target="_blank">
        <img src="https://i.imgur.com/4q9IcLX.png" height="20" width="20" />
      </a>
    </div>
  </div>

  <!-- Footer -->
</template>

<script>
export default {
  name: "Footer",

  data: () => ({
    icons: [
      "fab fa-facebook",
      "fab fa-twitter",
      "fab fa-google-plus",
      "fab fa-linkedin",
      "fab fa-instagram",
    ],
  }),
};
</script>
<style scoped>
@media only screen and (max-width: 480px) {
  #footer {
    display: none;
  }
}
@import url("https://fonts.googleapis.com/css?family=Open+Sans:400,300");

.card-footer {
  bottom: 0;
  margin-top: 2%;
  overflow: hidden;
  width: 100%;
  padding: 10px 0 30px 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  box-shadow: 0px -5px 21px 5px rgba(1, 31, 75, 0.57);
  /*-------------------------Gradient nebun in 3 culori daca trebuie candva
  background: rgb(15,15,15);
  background: linear-gradient(90deg, rgba(15,15,15,1) 0%, rgba(23,18,73,1) 41%, rgba(33,108,182,1) 100%);
  ------------------------------------------------------------------------- */
  background: #216cb6;
  background: -moz-linear-gradient(-45deg, #171249 0%, #216cb6 100%);
  background: -webkit-linear-gradient(-45deg, #171249 0%, #216cb6 100%);
  background: linear-gradient(135deg, #171249 0%, #216cb6 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#171249', endColorstr='#216CB6', GradientType=1 );
  box-sizing: border-box;
  align-items: center;
}
.card-footer p {
  color: #ffffff;
  margin: 20px 0 0 0;
  padding-left: 150px;
}
.social a {
  padding-left: 7px;
}
.social {
  height: 100%;
  padding-right: 3%;
  display: flex;
}
</style>
