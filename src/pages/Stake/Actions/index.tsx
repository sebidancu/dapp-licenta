import * as React from 'react';
import {
  transactionServices,
  useGetAccountInfo,
  useGetPendingTransactions,
  refreshAccount,
  useGetNetworkConfig
} from '@elrondnetwork/dapp-core';
import {
  AbiRegistry,
  Address,
  AddressValue,
  ContractFunction,
  Query,
  ResultsParser,
  SmartContract,
  SmartContractAbi,
  Transaction,
  TransactionPayload,
  TransactionVersion
} from '@elrondnetwork/erdjs';
import {
  ApiNetworkProvider,
  ProxyNetworkProvider
} from '@elrondnetwork/erdjs-network-providers/out';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios, { AxiosResponse } from 'axios';
import moment from 'moment';
import { contractAddress } from 'config';

const Actions = () => {
  const account = useGetAccountInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
  //const { network } = useGetNetworkConfig();
  const { address } = account;

  const [secondsLeft, setSecondsLeft] = React.useState<number>();
  const [hasPing, setHasPing] = React.useState<boolean>();
  const /*transactionSessionId*/ [, setTransactionSessionId] = React.useState<
      string | null
    >(null);

  const mount = () => {
    if (secondsLeft) {
      const interval = setInterval(() => {
        setSecondsLeft((existing) => {
          if (existing) {
            return existing - 1;
          } else {
            clearInterval(interval);
            return 0;
          }
        });
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(mount, [hasPing]);

  React.useEffect(() => {
    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction('getTimeToPong'),
      args: [new AddressValue(new Address(address))]
    });
    const proxy = new ProxyNetworkProvider('https://devnet-gateway.elrond.com');
    //const proxy = new ApiNetworkProvider('https://devnet-api.elrond.com');
    proxy
      .queryContract(query)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        console.log(returnData);
        switch (encoded) {
          case undefined:
            setHasPing(true);
            break;
          case '':
            setSecondsLeft(0);
            setHasPing(false);
            break;
          default: {
            const decoded = Buffer.from(encoded, 'base64').toString('hex');
            setSecondsLeft(parseInt(decoded, 16));
            setHasPing(false);
            break;
          }
        }
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPendingTransactions]);

  async function asyncCall() {
    const networkProvider = new ApiNetworkProvider(
      'https://devnet-api.elrond.com'
    );
    const response: AxiosResponse = await axios.get(
      'https://json.extendsclass.com/bin/5c7662316ba3'
    );
    const abiRegistry = AbiRegistry.create(response.data);
    const abi = new SmartContractAbi(abiRegistry, ['MyContract']);
    //erd1a8jaysc9aadaa57nm26nyz4euj994fsmmrkjpp2zg53gn3alj0wqls7f96
    const contractAddressStake = new Address(
      'erd1qqqqqqqqqqqqqpgq46x07dae3w8rr4hawgd7cyk7glt99nd3j0wqhh2mqz'
    );
    const contract = new SmartContract({
      address: contractAddressStake,
      abi: abi
    });
    const addressOfAlice = new Address(
      'erd1a8jaysc9aadaa57nm26nyz4euj994fsmmrkjpp2zg53gn3alj0wqls7f96'
    );

    const query = contract.createQuery({
      func: new ContractFunction('getNftInfo'),
      args: [new AddressValue(addressOfAlice)]
    });

    const queryResponse = await networkProvider.queryContract(query);
    //console.log(queryResponse);
    const endpointDefinition = contract.getEndpoint('getNftInfo');

    const resultsParser = new ResultsParser();
    const { firstValue } = resultsParser.parseQueryResponse(
      await queryResponse,
      endpointDefinition
    );

    console.log(firstValue?.valueOf());
    //console.log(firstValue.items[0].fields[0].value.value); //returneaza token identifier
    //console.log(firstValue.items[0].fields[1].value.value.c[0]); //returneaza nonce

    return firstValue;
  }

  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     await axios
  //       .post('https://devnet-api.elrond.com/query', {
  //         funcName: 'getTimeToPong',
  //         scAddress: contractAddress,
  //         args: [],
  //         value: '0'
  //       })
  //       .then((response) => {
  //         // logica
  //         console.log(response.data);
  //         const [encoded] = response.data;
  //         switch (encoded) {
  //           case undefined:
  //             setHasPing(true);
  //             break;
  //           case '':
  //             setSecondsLeft(0);
  //             setHasPing(false);
  //             break;
  //           default: {
  //             const decoded = Buffer.from(encoded, 'base64').toString('hex');
  //             setSecondsLeft(parseInt(decoded, 16));
  //             setHasPing(false);
  //             break;
  //           }
  //         }
  //       })
  //       .catch((error) => console.log(error));
  //   };
  //   fetchData().catch(console.error);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [hasPendingTransactions]);

  const { sendTransactions } = transactionServices;

  const sendPingTransaction = async () => {
    const pingTransaction = {
      value: '0',
      data: 'stake_nft',
      receiver: contractAddress
    };
    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
      transactions: pingTransaction,
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

  const sendPongTransaction = async () => {
    const pongTransaction = {
      value: '0',
      data: 'pong',
      receiver: contractAddress
    };
    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
      transactions: pongTransaction,
      transactionsDisplayInfo: {
        processingMessage: 'Processing Pong transaction',
        errorMessage: 'An error has occured during Pong',
        successMessage: 'Pong transaction successful'
      },
      redirectAfterSign: false
    });
    if (sessionId != null) {
      setTransactionSessionId(sessionId);
    }
  };

  const pongAllowed = secondsLeft === 0 && !hasPendingTransactions;
  const notAllowedClass = pongAllowed ? '' : 'not-allowed disabled';

  const timeRemaining = moment()
    .startOf('day')
    .seconds(secondsLeft || 0)
    .format('mm:ss');

  asyncCall();

  return (
    <div className='d-flex mt-4 justify-content-center'>
      {/* <div className='action-btn' onClick={sendPingTransaction}>
        <button className='btn'>
          <FontAwesomeIcon icon={faArrowUp} className='text-primary' />
        </button>
      </div> */}
      {hasPing !== undefined && (
        <>
          {hasPing && !hasPendingTransactions ? (
            <div className='action-btn' onClick={sendPingTransaction}>
              <button className='btn'>
                <FontAwesomeIcon icon={faArrowUp} className='text-primary' />
              </button>
              <a href='/' className='text-white text-decoration-none'>
                Ping
              </a>
            </div>
          ) : (
            <>
              <div className='d-flex flex-column'>
                <div
                  {...{
                    className: `action-btn ${notAllowedClass}`,
                    ...(pongAllowed ? { onClick: sendPongTransaction } : {})
                  }}
                >
                  <button className={`btn ${notAllowedClass}`}>
                    <FontAwesomeIcon
                      icon={faArrowDown}
                      className='text-primary'
                    />
                  </button>
                  <span className='text-white'>
                    {pongAllowed ? (
                      <a href='/' className='text-white text-decoration-none'>
                        Pong
                      </a>
                    ) : (
                      <>Pong</>
                    )}
                  </span>
                </div>
                {!pongAllowed && !hasPendingTransactions && (
                  <span className='opacity-6 text-white'>
                    {timeRemaining} until able to Pong
                  </span>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Actions;
