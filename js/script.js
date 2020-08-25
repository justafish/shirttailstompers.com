require('babel-polyfill');
const fetch = require('isomorphic-fetch');
const youTubePlayer = require('yt-player');

/**
 * Videos
 */
// Generated at https://console.developers.google.com/apis/credentials
const youTubeKey = 'AIzaSyD1DeOmS0xz-j6kQcPzxP4iGxJ9gaYQ_oE';

const player = new youTubePlayer('#video-player');
const list = document.querySelector('.video-thumbnails');
const listInner = document.createElement('ul');

fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLB2FB2679A8BA210D&key=${youTubeKey}`)
  .then(response => response.json())
  .then(response => response.items.map(item => item.snippet))
  .then(items => {
    player.load(items[0].resourceId.videoId, false);

    items.forEach(item => {
      const li = document.createElement('li');
      const img = document.createElement('img');
      const link = document.createElement('a');
      img.setAttribute('src', item.thumbnails.default.url);
      img.setAttribute('alt', item.title);
      link.setAttribute('href', `https://www.youtube.com/watch?v=${item.resourceId.videoId}`);
      link.setAttribute('data-ytid', item.resourceId.videoId);
      link.addEventListener('click', (e) => {
        e.preventDefault();
        player.load(link.getAttribute('data-ytid'));
      });
      link.appendChild(img);
      li.appendChild(link);
      listInner.appendChild(li);
    });
    list.appendChild(listInner);
  });

/**
 * Upcoming Gigs.
 */
const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const table = document.createElement('table');
fetch('https://cdn.contentful.com/spaces/q5cn5b15gi91/entries?' +
  'access_token=bcfa9c48805fff739ed352d5759d00723e2e328bc45889381562c3efc8a13c3f' +
  '&content_type=gig' +
  '&order=fields.dateAndTime')
  .then(response => response.json())
  .then(response => response.items.map(item => item.fields))
  .then(items => {
    items.forEach(item => {
      const row = document.createElement('tr');

      const tdTitle = document.createElement('td');
      const textTitle = document.createTextNode(item.title);

      if (item.link) {
        const link = document.createElement('a');
        link.setAttribute('href', item.link);
        link.appendChild(textTitle);
        tdTitle.appendChild(link);
      }
      else {
        tdTitle.appendChild(textTitle);
      }
      row.appendChild(tdTitle);

      const dateTime = new Date(item.dateAndTime);
      const dateTimeString = document.createTextNode(`${dayOfWeek[dateTime.getUTCDay()]} ${dateTime.getUTCDate()} ${months[dateTime.getUTCMonth()]} ${dateTime.getUTCFullYear()}`);
      const tdDateTime = document.createElement('td');
      tdDateTime.appendChild(dateTimeString);
      row.appendChild(tdDateTime);

      const tdAddress = document.createElement('td');
      if (item.address) {
        const addressLink = document.createElement('a');
        addressLink.setAttribute('href', `https://maps.google.com/?q${item.address}`);
        const address = document.createTextNode(item.address);
        addressLink.appendChild(address);
        tdAddress.appendChild(addressLink);
      }
      row.appendChild(tdAddress);

      table.appendChild(row);
    });

    const gigs = document.querySelector('.gigs').appendChild(table);
  });
