/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import {
  useGetAccountInfo,
  transactionServices,
  refreshAccount,
  useGetNetworkConfig,
  useGetPendingTransactions
} from '@elrondnetwork/dapp-core';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { getTransactions } from 'apiRequests';
import { contractAddress } from 'config';
import TransactionsList from './TransactionsList';
import { StateType } from './types';
import { Button, Card, Col, Container, Form, Row, Dropdown, DropdownButton } from 'react-bootstrap';
import axios, { AxiosResponse } from 'axios';
import { AbiRegistry, Address, AddressValue, ContractFunction, ResultsParser, SmartContract, SmartContractAbi } from '@elrondnetwork/erdjs/out';

const MintForm = () => {
  const account = useGetAccountInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
  //const { network } = useGetNetworkConfig();
  const { address } = account;

  const [secondsLeft, setSecondsLeft] = React.useState<number>();
  const [hasPing, setHasPing] = React.useState<boolean>();
  const [price, setPrice] = React.useState<any>();
  const [token_left, setToken_left] = React.useState<any>();
  const [nftnumber, setNftnumber] = React.useState<number>(1);
  const [pricetx, setPricetx] = React.useState<any>();
  const /*transactionSessionId*/[, setTransactionSessionId] = React.useState<
    string | null
  >(null);
  const { sendTransactions } = transactionServices;

  function numtoHex(num: number) {
    let result = num.toString(16);
    if (result.length % 2 == 1) {
      result = '0' + result;
    }
    return result;
  }

  const sendMint = async () => {
    const mintTransaction = {
      value: pricetx * nftnumber,
      data: 'mint@'+numtoHex(nftnumber),
      receiver: contractAddress,
      gasLimit: '50000000'
    };
    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
      transactions: mintTransaction,
      transactionsDisplayInfo: {
        processingMessage: 'Processing Ping transaction',
        errorMessage: 'An error has occured during Ping',
        successMessage: 'Ping transaction successful'
      },
      redirectAfterSign: false
    });
    if (sessionId != null) {
      setTransactionSessionId(sessionId);
    }
  };

  useEffect(() => {
    (async () => {
      await axios.post('https://devnet-api.elrond.com/query', {
        funcName: 'getTotalTokensLeft',
        scAddress: contractAddress,
        args: [],
        value: '0',
      })
        .then((response) => {
          const hex = Buffer.from(response.data.returnData[0], 'base64').toString('hex');
          const decimal = parseInt(hex, 16);
          setToken_left(decimal);
        })
        .catch((error) => console.log(error));
    })();
  }, [contractAddress]);

  useEffect(() => {
    (async () => {
      await axios.post('https://devnet-api.elrond.com/query', {
        funcName: 'getNftPrice',
        scAddress: contractAddress,
        args: [],
        value: '0',
      })
        .then((response) => {
          const hex = Buffer.from(response.data.returnData[0], 'base64').toString('hex');
          const decimal = parseInt(hex, 16);
          setPrice(decimal / Math.pow(10, 18));
          setPricetx(decimal);
        })
        .catch((error) => console.log(error));
    })();
  }, [contractAddress]);

  
  const handleSelect = (e: any) => {
    console.log(e);
    setNftnumber(e);
  };

  return (
    <Container>
      <Row>
        <Col>
          <div className='text-center'>
            <h1 >⚡ <b>Mint an NFT</b></h1>
          </div>
          <div className='text-left' style={{ margin: '30px' }}>
            <p style={{ fontWeight: '300', fontSize: '18px' }}>Pentru a minta un NFT trebuie sa fii logat pe website cu un wallet elrond.</p>
          </div>
          <div className='py-2'>
            <h4>
              NFTs ramase de mintat: <span style={{ color: '#1c46c2', fontWeight: '600', fontSize: '28px' }}>{token_left}</span>
            </h4>
          </div>
          <div className='py-2'>
            <h4>
              Pret: <span style={{ color: '#1c46c2', fontWeight: '600', fontSize: '28px' }}>{price} EGLD</span>

            </h4>
          </div>

        </Col>
        <Col>
          <div className='text-center'>
            <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" src="https://devnet-api.elrond.com/nfts/ULBS-c22d32-01/thumbnail" />
              <Card.Body>
                <Card.Title><h2>ULBS Collection</h2></Card.Title>

                <Card.Text>
                  Aceste NFT-uri au fost înregistrate pe reteaua devnet cu scop demonstrativ.
                </Card.Text>
                <Container>
                  <Row>
                    <Col>
                      <DropdownButton
                        title={nftnumber}
                        id="dropdown-menu-align-right"
                        onSelect={handleSelect}
                        defaultValue='1'
                        style={{ fontSize: 20, margin: '3px' }}
                      >
                        <Dropdown.Item eventKey="1">1</Dropdown.Item>
                        <Dropdown.Item eventKey="2">2</Dropdown.Item>
                        <Dropdown.Item eventKey="3">3</Dropdown.Item>
                      </DropdownButton>
                    </Col>
                    <Col>
                      <Button variant="primary" style={{ fontSize: 20, margin: '3px' }} onClick={sendMint}>MINT</Button>
                    </Col>
                  </Row>
                </Container>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MintForm;
