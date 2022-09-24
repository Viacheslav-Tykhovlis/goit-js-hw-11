import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const KEY = '30132115-7f2225df990f8cd81354d9436';

export class ApiService {
  constructor() {
    this.searchText = '';
    this.page = 1;
  }

  async getImages() {
    try {
      const { data } = await axios.get(
        `?key=${KEY}&q=${this.searchText}s&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=5`
      );
      //   console.log(data);
      this.page += 1;
      return data;
    } catch (error) {
      Report.failure(error);
    }
  }

  resetPage() {
    this.page = 1;
  }

  get text() {
    return this.searchText;
  }

  set text(newText) {
    this.searchText = newText;
  }
}
