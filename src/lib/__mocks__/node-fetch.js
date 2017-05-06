class Response {
  constructor(data, status = 200) {
    this.data = data;
    this.status = status;
  }

  json() {
    return Promise.resolve(this.data);
  }

  text() {
    return Promise.resolve(this.data);
  }
}

const fetch = jest.fn();

fetch.mockReturnValue(Promise.resolve(new Response({ response_code: 0 })));

fetch.setMockResponseData = (data, status = 200) => {
  fetch.mockReturnValue(Promise.resolve(new Response(data, status)));
};

module.exports = fetch;
