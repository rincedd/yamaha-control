class Response {
  constructor(json) {
    this.json = json;
  }

  json() {
    return Promise.resolve(this.json);
  }
}

const fetch = jest.fn();

fetch.mockReturnValue(Promise.resolve(new Response({ response_code: 0 })));

fetch.setMockResponseJSON = (json) => {
  fetch.mockReturnValue(Promise.resolve(new Response(json)));
};

module.exports = fetch;
