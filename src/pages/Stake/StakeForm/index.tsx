/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import {
  useGetAccountInfo,
  transactionServices,
  refreshAccount,
  useGetPendingTransactions,
} from '@elrondnetwork/dapp-core';
import { ApiNetworkProvider } from '@elrondnetwork/erdjs-network-providers/out';
import {
  AbiRegistry,
  Address,
  AddressValue,
  ContractFunction,
  ResultsParser,
  SmartContract,
  SmartContractAbi,
} from '@elrondnetwork/erdjs/out';
import axios, { AxiosResponse } from 'axios';
import { Button, Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
import Countdown from 'react-countdown';
import { StakeContract } from 'config';


const StakeForm = () => {
  const account = useGetAccountInfo();
  const { address } = account;
  const [items, setItems] = useState([]);
  const [nftData, setNftData] = useState<any>([]);
  const [nftReady, setNftReady] = useState(false);
  const nftStakingAddress = StakeContract;

  const /*transactionSessionId*/[, setTransactionSessionId] = React.useState<
    string | null
  >(null);
  const { sendTransactions } = transactionServices;

  async function asyncCall(wallet: any) {
    const networkProvider = new ApiNetworkProvider(
      'https://devnet-api.elrond.com'
    );
    const response: AxiosResponse = await axios.get(
      'https://api.jsonstorage.net/v1/json/b6ff7157-666c-4d1c-af4c-02c64da81a0d/e9302656-2d9e-40d0-8b94-ad4763e1875b'
    );
    const abiRegistry = AbiRegistry.create(response.data);
    const abi = new SmartContractAbi(abiRegistry, ['MyContract']);
    const contractAddressStake = new Address(nftStakingAddress);
    const contract = new SmartContract({
      address: contractAddressStake,
      abi: abi,
    });
    const addressOfAlice = new Address(wallet);

    const query = contract.createQuery({
      func: new ContractFunction('getNftInfo'),
      args: [new AddressValue(addressOfAlice)],
    });

    const queryResponse = await networkProvider.queryContract(query);
    const endpointDefinition = contract.getEndpoint('getNftInfo');

    const resultsParser = new ResultsParser();
    const { firstValue } = resultsParser.parseQueryResponse(
      await queryResponse,
      endpointDefinition
    );

    return firstValue?.valueOf();
  }

  useEffect(() => {
    (async () => {
      await axios
        .get(
          `https://devnet-api.elrond.com/accounts/${address}/nfts?collection=ULBS-c22d32`
        )
        .then(
          async (result) => {
            setItems(result.data);
            console.log(result.data);
          },
          (error) => {
            console.log(error);
          }
        )
        .catch((err) => {
          console.log(err.message);
        });
    })();
  }, [address]);

  useEffect(() => {
    (async () => {
      await asyncCall(address).then((result) => {
        setNftData(result);
        setNftReady(true);
        console.log(result);
      });
    })();
  }, []);

  const sendStakeTransaction = async (token_id: any, nft_nonce: any) => {
    const stakeTransaction = {
      value: '0',
      data:
        'ESDTNFTTransfer@' +
        strtoHex(token_id) +
        '@' +
        numtoHex(nft_nonce) +
        '@' +
        numtoHex(1) +
        '@' +
        new Address(nftStakingAddress).hex() +
        '@' +
        strtoHex('stake_nft'),
      receiver: address,
      gasLimit: '5000000'
    };
    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
      transactions: stakeTransaction,
      transactionsDisplayInfo: {
        processingMessage: 'Processing stake transaction',
        errorMessage: 'An error has occured during stake',
        successMessage: 'Stake transaction successful'
      },
      redirectAfterSign: false
    });
    if (sessionId != null) {
      setTransactionSessionId(sessionId);
    }
  };

  const claim_rewards = async (token_id: any, nft_nonce: any) => {
    const claimrewardTx = {
      value: '0',
      data: 'claim_rewards@' + strtoHex(token_id) + '@' + numtoHex(nft_nonce),
      receiver: nftStakingAddress,
      gasLimit: '5000000'
    };
    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
      transactions: claimrewardTx,
      transactionsDisplayInfo: {
        processingMessage: 'Processing Ping transaction',
        errorMessage: 'An error has occured during Ping',
        successMessage: 'Ping transaction successful',
      },
      redirectAfterSign: false,
    });
    if (sessionId != null) {
      setTransactionSessionId(sessionId);
    }
  };

  const claim_nft = async (token_id: any, nft_nonce: any) => {
    const claimrewardTx = {
      value: '0',
      data: 'claim_nft@' + strtoHex(token_id) + '@' + numtoHex(nft_nonce),
      receiver: nftStakingAddress,
      gasLimit: '10000000'
    };
    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
      transactions: claimrewardTx,
      transactionsDisplayInfo: {
        processingMessage: 'Processing Ping transaction',
        errorMessage: 'An error has occured during Ping',
        successMessage: 'Ping transaction successful',
      },
      redirectAfterSign: false,
    });
    if (sessionId != null) {
      setTransactionSessionId(sessionId);
    }
  };

  const withdraw_request = async (token_id: any, nft_nonce: any) => {
    const claimrewardTx = {
      value: '0',
      data: 'withdraw_request@' + strtoHex(token_id) + '@' + numtoHex(nft_nonce),
      receiver: nftStakingAddress,
      gasLimit: '10000000'
    };
    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
      transactions: claimrewardTx,
      transactionsDisplayInfo: {
        processingMessage: 'Processing Ping transaction',
        errorMessage: 'An error has occured during Ping',
        successMessage: 'Ping transaction successful',
      },
      redirectAfterSign: false,
    });
    if (sessionId != null) {
      setTransactionSessionId(sessionId);
    }
  };
  function strtoHex(str: string) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      result += str.charCodeAt(i).toString(16);
    }
    if (result.length % 2 == 1) {
      result = '0' + result;
    }
    return result;
  }

  function numtoHex(num: number) {
    let result = num.toString(16);
    if (result.length % 2 == 1) {
      result = '0' + result;
    }
    return result;
  }

  function calculate_reward(timestamp: any) {
    const month = 2629743;
    const reward_per_second = 10000 / month;
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const multiplier = currentTimeInSeconds - timestamp;
    const actual_reward = multiplier * reward_per_second / 10;

    return actual_reward;
  }

  function calculate_withdraw_timestamp(timestamp: any) {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const date = new Date(timestamp - currentTimeInSeconds).getTime();
    return (date*1000);

  }

  return (
    <Container>
      <Row>
        <Col>
          <div className="text-center">
            <h1>
              ⚡ <b>Stake NFT</b>
            </h1>
          </div>
          <div className="text-center" style={{ margin: '30px' }}>
            <p style={{ fontWeight: '300', fontSize: '18px' }}>
              Pentru a pune la stake un NFT trebuie sa il ai in portofelul
              Elrond.
            </p>
          </div>
          <div className="text-center">
            <h2>
              Detineti <b>{items.length}</b> NFT-uri ULBS
            </h2>
          </div>
          <Tabs
            defaultActiveKey="home"
            id="uncontrolled-tab-example"
            className="mt-5 mb-3 justify-content-center"
          >
            <Tab eventKey="home" title="Stake">
              <div className="row justify-content-center">
                {items.map((value: any, index) => (
                  <div key={index}>
                    <div key={index} style={{ margin: '25px' }} className="bs">
                      <img
                        src={value.url}
                        alt="nft"
                        style={{
                          height: '200px',
                          width: '200px',
                          margin: '0px',
                          borderRadius: 10,
                          border: '5px black solid',
                        }}
                      />
                      <div>
                        <h3>{value.identifier}</h3>
                      </div>
                      <div>
                        <div className="text-center">
                          <br />
                          <Button
                            variant="primary"
                            style={{
                              width: '200px',
                              backgroundColor: 'black',
                              color: 'white',
                              borderRadius: 15,
                            }}
                            onClick={() => sendStakeTransaction(value.collection, value.nonce)}
                          >
                            Stake
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Tab>
            <Tab eventKey="profile" title="Harvest">
              <div className="row justify-content-center">
                {nftReady
                  ? nftData.map((value: any, index: any) => {
                    return (
                      <div key={index} style={{ margin: '25px' }} className="bs">
                        {value.withdraw_timestamp.c[0] === 1 &&
                          <span>
                            <img
                              src={`https://devnet-api.elrond.com/nfts/${value.token_identifier + '-' + numtoHex(value.nft_nonce.c[0])}/thumbnail`}
                              alt="nft"
                              style={{
                                height: '200px',
                                width: '200px',
                                margin: '0px',
                                borderRadius: 10,
                                border: '5px black solid',
                              }}
                            />
                            <h3>
                              {value.token_identifier}
                              {'-0' + value.nft_nonce.c[0]}
                            </h3>
                            <div className="text-center">
                              <br />
                              <h4>Rewards: </h4>
                              <h4>{((calculate_reward(value.timestamp.c[0])).toString()).substring(0, 6)} <b>$ART</b></h4>
                              <Button
                                variant="primary"
                                style={{
                                  width: '200px',
                                  backgroundColor: 'black',
                                  color: 'white',
                                  borderRadius: 15,
                                }}
                                onClick={() => claim_rewards(value.token_identifier, value.nft_nonce.c[0])}
                              >
                                Harvest Rewards
                              </Button>
                            </div>
                            <div className="text-center">
                              <br />
                              <Button
                                variant="primary"
                                style={{
                                  width: '200px',
                                  backgroundColor: 'black',
                                  color: 'white',
                                  borderRadius: 15,
                                }}
                                onClick={() => withdraw_request(value.token_identifier, value.nft_nonce.c[0])}
                              >
                                Withdraw Request
                              </Button>
                            </div>
                          </span>
                        }
                      </div>
                    );
                  })
                  : ''}
              </div>
            </Tab>
            <Tab eventKey="contact" title="Claim">
              <div className="row justify-content-center">
                {nftReady
                  ? nftData.map((value: any, index: any) => {
                    return (
                      <div key={index} style={{ margin: '25px' }} className="bs">
                        {value.withdraw_timestamp.c[0] > 1 &&
                          <span>
                            <img
                              src={`https://devnet-api.elrond.com/nfts/${value.token_identifier + '-' + numtoHex(value.nft_nonce.c[0])}/thumbnail`}
                              alt="nft"
                              style={{
                                height: '200px',
                                width: '200px',
                                margin: '0px',
                                borderRadius: 10,
                                border: '5px black solid',
                              }}
                            />
                            <h3>
                              {value.token_identifier}
                              {'-0' + value.nft_nonce.c[0]}
                            </h3>
                            <div className="text-center">
                              <br />
                              {/* <div>{calculate_withdraw_timestamp(1655855912)}</div> value.withdraw_timestamp.c[0] */}
                              <Countdown date={Date.now() + calculate_withdraw_timestamp(value.withdraw_timestamp.c[0])} />
                              <br></br>
                              <Button
                                variant="primary"
                                style={{
                                  width: '200px',
                                  backgroundColor: 'black',
                                  color: 'white',
                                  borderRadius: 15,
                                }}
                                onClick={() => claim_nft(value.token_identifier, value.nft_nonce.c[0])}
                              >
                                Claim
                              </Button>
                            </div>
                          </span>
                        }
                      </div>
                    );
                  })
                  : ''}
              </div>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default StakeForm;
