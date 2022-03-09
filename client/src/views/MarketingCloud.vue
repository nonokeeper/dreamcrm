<template>
  <div>
    Marketing Cloud
    Token : {{ token }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const urlDeleteDatastore = ref ('https://eu2.thunderhead.com/datastores/1.0.0/');
const urlISToken = ref('https://eu2.thunderhead.com/one/oauth2token');
const urlSFMCToken = ref('https://mc4m3gyjn-56t5p2511h2mb76-xq.auth.marketingcloudapis.com/v2/token');
const payload = {
  "grant_type": "client_credentials",
  "client_id": "pm3vo9fzp81benu54s71hksn",
  "client_secret": "k4zweavfyQcMGaYw0oqog2iE",
  "account_id": "7213695"
};
const count = ref(0);

// Request SFMC Token
const getToken = async (body:{}) => {
  try {
    const res = await axios.post(urlSFMCToken.value, body, {
      headers: {
        'content-type': 'text/json',
        'Accept': '*/*'
      }
    })
    return res.data
  } catch (err) {
    console.log('getToken error : ' + err)
    return (err)
  }
};

const token = getToken (payload);
console.log(token);