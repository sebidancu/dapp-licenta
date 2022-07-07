import * as React from 'react';
import Actions from './Actions';
import TopInfoMint from './TopInfoMint';
import Transactions from './MintForm';

const Mint = () => {
  return (
    <div className='container py-4'>
      <div className='row'>
        <div className='col-12 col-md-10 mx-auto'>
          <div className='card shadow-sm rounded border-0'>
            <div className='card-body p-1'>
              <div className='card rounded border-0 bg-primary'>
                <div className='card-body text-center p-4'>
                  <TopInfoMint />
                  {/* <Actions /> */}
                </div>
              </div>
              <div style={{ margin: '30px' }}>
                <Transactions />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mint;
