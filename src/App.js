import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button, List, Divider, Grid, Input } from "semantic-ui-react";
import LoadingIndicator from "./widgets/LoadingIndicator";
import { InputField, SubmitField } from "./widgets/Input";
import { Heading } from "./widgets/Header";
import { allSymbols } from "./stocks/data";
const Fragment = React.Fragment;
class App extends Component {
  state = {
    stockData: [],
    url: "https://api.robinhood.com/quotes/?symbols=TSLA",
    test: 0,
    Loading: true,
    error: false,
    date: "",
    search: "",
    symbols: ["FB", "NVDA"],
    symbol: "",
    notASymbol: "",
    allSymbolsURL: "",
    topSpread: [],
    loadSpreadCount: 0,
    spreadLow: 0.1,
    spreadHigh: 1
  };

  delay = (callback, time) => {
    return new Promise(function(resolve) {
      setTimeout(function() {
        callback();
        resolve();
      }, time);
    });
  };

  getDataFromApi = () => {
    let temp = ``;
    const { symbols } = this.state;
    if (symbols.length) {
      for (var i = 0; i < symbols.length; i++) {
        temp += `,${symbols[i]}`;
      }
    }
    const url = this.state.url + temp;

    //  const url2 =   `https://api.robinhood.com/quotes/?symbols=${}`

    fetch(url)
      .then(res => res.json())
      .then(
        res => {
          const sortedRes = res["results"].sort(function(a, b) {
            return b.ask_price - b.bid_price - (a.ask_price - a.bid_price);
          });
          this.setState({
            stockData: sortedRes,
            Loading: false
          });
        },
        res => this.setState({ error: true })
      );
  };

  componentDidMount() {
    const currentdate = new Date().getTime();
    this.setState({ date: currentdate });

    this.clockCall = setInterval(() => {
      this.incrementClock();
    }, 1000);

    this.apiCall = setInterval(() => {
      //this.setState((prevstate) => ({test:prevstate.test + 1}))
      this.getDataFromApi();
    }, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.apiCall);
    clearInterval(this.clockCall);
  }

  incrementClock = () => {
    var date = new Date();
    var n = date.toDateString();
    var time = date.toLocaleTimeString();
    this.setState({ date: time });
  };

  setInput = (field, value) => {
    this.setState({ [field]: value });
  };

  addSymbol = () => {
    const { symbols, symbol,url } = this.state;
    const isSymbol = allSymbols.filter(item => item === symbol.toUpperCase());
    console.log(isSymbol);

    if (isSymbol.length) {
      if (url.includes(symbol) || symbols.includes(symbol)) {
        this.setState({
          notASymbol: (
            <div style={{ color: "white" }}> {symbol} is already loaded </div>
          )
        });
        return;
      }
      const temp = symbols.slice();
      temp.push(symbol.toUpperCase());
      this.setState({ symbols: temp, notASymbol: "", symbol: "" });
    } else {
      this.setState({
        notASymbol: (
          <div style={{ color: "white" }}> {symbol} is not a valid symbol </div>
        )
      });
    }
  };

  highestSpreadStocks = () => {
    const { topSpread, loadSpreadCount, spreadLow, spreadHigh } = this.state;
    const tempSymbs = !topSpread.length
      ? allSymbols.filter((item, index) => index < 25)
      : allSymbols.filter(
          (item, index) =>
            (index > loadSpreadCount * 25) &
            (index < (loadSpreadCount + 1) * 25)
        );
    console.log(tempSymbs);
    const allStocksSymbols = tempSymbs.join(",");

    const URL = `https://api.robinhood.com/quotes/?symbols=${allStocksSymbols}`;
    console.log(allStocksSymbols);
    console.log(URL);
    this.setState({ Loading: true });
    fetch(URL)
      .then(res => res.json())
      .then(
        res => {
          console.log(res);
          const sortedRes = res["results"].filter(
            item =>
              item &&
              Boolean &&
              item.ask_price !== null &&
              item.bid_price !== null &&
              item.ask_price - item.bid_price > spreadLow &&
              item.ask_price - item.bid_price < spreadHigh
          );
          this.setState(prevstate => ({
            topSpread: prevstate.topSpread.concat(sortedRes),
            Loading: false,
            loadSpreadCount: prevstate.loadSpreadCount + 1
          }));
        },
        res => this.setState({ error: true })
      );
  };

  //      <SubmitField size='big' text='add new stock' functionToExecute={this.addSymbol} /> <br />

  render() {
    const {
      stockData,
      Loading,
      notASymbol,
      symbol,
      topSpread,
      error
    } = this.state;

    const SymbolStyle = { color: "#e5e5e5", fontSize: 16 };
    return (
      <div className="App">
        <Heading />
        <div className="symbolcolor">
          {!Loading && (
            <Fragment>
              {" "}
              {this.state.date} <Divider inverted />{" "}
            </Fragment>
          )}
        </div>
        <Tools
          value={symbol}
          addSymbol={this.addSymbol}
          setInput={this.setInput}
          highestSpreadStocks={this.highestSpreadStocks}
        />

        {notASymbol}
        {Loading && <LoadingIndicator />}
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Fragment>
                <List>
                  <List.Header style={SymbolStyle}>Watch List</List.Header>{" "}
                  {!Loading &&
                    stockData.length &&
                    stockData.map(item => (
                      <List.Item key={item.symbol}>
                        <List.Content>
                          <List.Header style={SymbolStyle}>
                            {item.symbol}
                          </List.Header>
                          <List.List className="symbolcolor">
                            <List.Item> Bid Price: {item.bid_price}</List.Item>
                            <List.Item> Ask Price: {item.ask_price}</List.Item>
                            <List.Item>
                              {" "}
                              Spread:{" "}
                              {(item.ask_price - item.bid_price).toFixed(2)}
                            </List.Item>
                            <List.Item>
                              <Divider inverted />
                            </List.Item>
                          </List.List>
                        </List.Content>
                      </List.Item>
                    ))}{" "}
                </List>
              </Fragment>
            </Grid.Column>
            <Grid.Column width={8}>
              <h1 style={SymbolStyle}> Spread Finder </h1>

              {topSpread.length &&
                topSpread.map(item => (
                  <div style={SymbolStyle}>
                    {" "}
                    {item.symbol}{" "}
                    <span className="symbolcolor">
                      {" "}
                      Spread:{(item.ask_price - item.bid_price).toFixed(2)}{" "}
                    </span>{" "}
                  </div>
                ))}
              <Divider inverted />
            </Grid.Column>
          </Grid.Row>

          {/** <Grid.Row>
              <Grid.Column width={8}>
              <h1 style={SymbolStyle}> Random Stocks</h1>
                <Divider inverted />
              </Grid.Column>
              <Grid.Column width={8}>
                <h1 style={SymbolStyle}> Hello </h1>
                <Divider inverted />
              </Grid.Column>
            </Grid.Row> **/}
        </Grid>
      </div>
    );
  }
}

const Tools = props => {
  return (
    <div className="Tools">
      <Grid>
        <Grid.Row>
          <Grid.Column width={8}>
            <InputField
              value={props.value}
              size="mini"
              placeholder="MSFT"
              label={{ content: "SYMB" }}
              addSymbol={props.addSymbol}
              setInput={props.setInput}
            />
          </Grid.Column>
          <Grid.Column width={8}>
            <SpreadTools
              highestSpreadStocks={props.highestSpreadStocks}
              setInput={props.setInput}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Divider inverted />
    </div>
  );
};

const SpreadTools = props => (
  <div style={{ color: "#e5e5e5" }}>
    <span style={{ margin: 2 }}> Low: </span>{" "}
    <Input
      onChange={e => props.setInput("spreadLow", e.target.value)}
      size="mini"
      label={{ content: "SPREAD" }}
    />
    <span style={{ margin: 2 }}> High: </span>{" "}
    <Input
      onChange={e => props.setInput("spreadHigh", e.target.value)}
      size="mini"
      label={{ content: "SPREAD" }}
    />
    <Button
      size="tiny"
      style={{ margin: 5 }}
      placeholder="Load"
      onClick={() => props.highestSpreadStocks()}
    >
      {" "}
      Load Stocks{" "}
    </Button>
  </div>
);

export default App;
