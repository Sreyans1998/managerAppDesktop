const baseUrl = "http://localhost:8000/";
const analystBaseUrl = "http://ec2-3-82-162-247.compute-1.amazonaws.com:8088/";
export function getPosition() {
    return fetch(baseUrl + "api/positions/", {
        method: "GET",
        headers: {
            // "Authorization": token,
            "Content-type": "application/json",
        },
    }).then((resposne) => {
        return resposne;
    }).catch((error) => {
        return error;
    });
};

export function buyOrder(payload) {
    return fetch(baseUrl + "api/buy/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    }).then((response) => {
        return response;
    }).catch((error) => {
        return error;
    });
};

export function sellOrder(payload) {
    return fetch(baseUrl+ "api/sell/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    }).then((response) => {
        return response;
    }).catch((error) => {
        return error;
    });
};

export function sellAllOrder() {
    return fetch(baseUrl+ "api/sell_all/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        return response;
    }).catch((error) => {
        return error;
    });
};

export function getRunners() {
    return fetch(baseUrl + "api/runners/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((resposne) => {
        return resposne;
    }).catch((error) => {
        return error;
    });
};

export function addStop(payload) {
    return fetch(baseUrl + "api/add_stop/", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(payload),
    }).then((response) => {
        return response;
    }).catch((error) => {
        return error;
    });
};

export function cancelStop(payload) {
    return fetch(baseUrl + "api/cancel_stop/", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(payload),
    }).then((response) => {
        return response;
    }).catch((error) => {
        return error;
    });
};

export function addMIT(payload) {
    return fetch(baseUrl + "api/add_mit/", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(payload),
    }).then((response) => {
        return response;
    }).catch((error) => {
        return error;
    });
};

export function cancelMIT(payload) {
    return fetch(baseUrl + "api/cancel_mit/", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(payload),
    }).then((response) => {
        return response;
    }).catch((error) => {
        return error;
    });
};

export function getOrders(payload) {
    return fetch(baseUrl + "api/orders/", {
        method: "GET",
        headers: {
            "Content-type": "application/json",
        },
    }).then((response) => {
        return response;
    }).catch((error) => {
        return error;
    })
};

export function getSentiments() {
    return fetch(analystBaseUrl + "sentiments/", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
};

export function getRunSentiments(payload) {
    return fetch(analystBaseUrl + "run_sentiments/", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
};

export function getUpgrades() {
    return fetch(analystBaseUrl + "upgrades", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
};

export function getRunUpgrades(payload) {
    return fetch(analystBaseUrl + "run_upgrades/", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
};
