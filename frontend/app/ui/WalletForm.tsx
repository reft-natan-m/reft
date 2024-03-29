"use client";

import { Modal, List } from "flowbite-react";
import Link from "next/link";
import { useState } from "react";

function WalletForm() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 dark:bg-gray-800 dark:border-gray-700">
      <h5 className="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">
        Connect wallet
      </h5>
      <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
        Connect with Metamask or create a metamask account if you don't have
        one.
      </p>
      <ul className="my-4 space-y-3 divide-y divide-gray-200 dark:divide-gray-700">
        <li>
          <Link
            href="#"
            className="flex items-center mb-4 p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
          >
            <svg
              aria-hidden="true"
              className="h-4"
              viewBox="0 0 40 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M39.0728 0L21.9092 12.6999L25.1009 5.21543L39.0728 0Z"
                fill="#E17726"
              />
              <path
                d="M0.966797 0.0151367L14.9013 5.21656L17.932 12.7992L0.966797 0.0151367Z"
                fill="#E27625"
              />
              <path
                d="M32.1656 27.0093L39.7516 27.1537L37.1004 36.1603L27.8438 33.6116L32.1656 27.0093Z"
                fill="#E27625"
              />
              <path
                d="M7.83409 27.0093L12.1399 33.6116L2.89876 36.1604L0.263672 27.1537L7.83409 27.0093Z"
                fill="#E27625"
              />
              <path
                d="M17.5203 10.8677L17.8304 20.8807L8.55371 20.4587L11.1924 16.4778L11.2258 16.4394L17.5203 10.8677Z"
                fill="#E27625"
              />
              <path
                d="M22.3831 10.7559L28.7737 16.4397L28.8067 16.4778L31.4455 20.4586L22.1709 20.8806L22.3831 10.7559Z"
                fill="#E27625"
              />
              <path
                d="M12.4115 27.0381L17.4768 30.9848L11.5928 33.8257L12.4115 27.0381Z"
                fill="#E27625"
              />
              <path
                d="M27.5893 27.0376L28.391 33.8258L22.5234 30.9847L27.5893 27.0376Z"
                fill="#E27625"
              />
              <path
                d="M22.6523 30.6128L28.6066 33.4959L23.0679 36.1282L23.1255 34.3884L22.6523 30.6128Z"
                fill="#D5BFB2"
              />
              <path
                d="M17.3458 30.6143L16.8913 34.3601L16.9286 36.1263L11.377 33.4961L17.3458 30.6143Z"
                fill="#D5BFB2"
              />
              <path
                d="M15.6263 22.1875L17.1822 25.4575L11.8848 23.9057L15.6263 22.1875Z"
                fill="#233447"
              />
              <path
                d="M24.3739 22.1875L28.133 23.9053L22.8184 25.4567L24.3739 22.1875Z"
                fill="#233447"
              />
              <path
                d="M12.8169 27.0049L11.9606 34.0423L7.37109 27.1587L12.8169 27.0049Z"
                fill="#CC6228"
              />
              <path
                d="M27.1836 27.0049L32.6296 27.1587L28.0228 34.0425L27.1836 27.0049Z"
                fill="#CC6228"
              />
              <path
                d="M31.5799 20.0605L27.6165 24.0998L24.5608 22.7034L23.0978 25.779L22.1387 20.4901L31.5799 20.0605Z"
                fill="#CC6228"
              />
              <path
                d="M8.41797 20.0605L17.8608 20.4902L16.9017 25.779L15.4384 22.7038L12.3988 24.0999L8.41797 20.0605Z"
                fill="#CC6228"
              />
              <path
                d="M8.15039 19.2314L12.6345 23.7816L12.7899 28.2736L8.15039 19.2314Z"
                fill="#E27525"
              />
              <path
                d="M31.8538 19.2236L27.2061 28.2819L27.381 23.7819L31.8538 19.2236Z"
                fill="#E27525"
              />
              <path
                d="M17.6412 19.5088L17.8217 20.6447L18.2676 23.4745L17.9809 32.166L16.6254 25.1841L16.625 25.1119L17.6412 19.5088Z"
                fill="#E27525"
              />
              <path
                d="M22.3562 19.4932L23.3751 25.1119L23.3747 25.1841L22.0158 32.1835L21.962 30.4328L21.75 23.4231L22.3562 19.4932Z"
                fill="#E27525"
              />
              <path
                d="M27.7797 23.6011L27.628 27.5039L22.8977 31.1894L21.9414 30.5138L23.0133 24.9926L27.7797 23.6011Z"
                fill="#F5841F"
              />
              <path
                d="M12.2373 23.6011L16.9873 24.9926L18.0591 30.5137L17.1029 31.1893L12.3723 27.5035L12.2373 23.6011Z"
                fill="#F5841F"
              />
              <path
                d="M10.4717 32.6338L16.5236 35.5013L16.4979 34.2768L17.0043 33.8323H22.994L23.5187 34.2753L23.48 35.4989L29.4935 32.641L26.5673 35.0591L23.0289 37.4894H16.9558L13.4197 35.0492L10.4717 32.6338Z"
                fill="#C0AC9D"
              />
              <path
                d="M22.2191 30.231L23.0748 30.8354L23.5763 34.8361L22.8506 34.2234H17.1513L16.4395 34.8485L16.9244 30.8357L17.7804 30.231H22.2191Z"
                fill="#161616"
              />
              <path
                d="M37.9395 0.351562L39.9998 6.53242L38.7131 12.7819L39.6293 13.4887L38.3895 14.4346L39.3213 15.1542L38.0875 16.2779L38.8449 16.8264L36.8347 19.1742L28.5894 16.7735L28.5179 16.7352L22.5762 11.723L37.9395 0.351562Z"
                fill="#763E1A"
              />
              <path
                d="M2.06031 0.351562L17.4237 11.723L11.4819 16.7352L11.4105 16.7735L3.16512 19.1742L1.15488 16.8264L1.91176 16.2783L0.678517 15.1542L1.60852 14.4354L0.350209 13.4868L1.30098 12.7795L0 6.53265L2.06031 0.351562Z"
                fill="#763E1A"
              />
              <path
                d="M28.1861 16.2485L36.9226 18.7921L39.7609 27.5398L32.2728 27.5398L27.1133 27.6049L30.8655 20.2912L28.1861 16.2485Z"
                fill="#F5841F"
              />
              <path
                d="M11.8139 16.2485L9.13399 20.2912L12.8867 27.6049L7.72971 27.5398H0.254883L3.07728 18.7922L11.8139 16.2485Z"
                fill="#F5841F"
              />
              <path
                d="M25.5283 5.17383L23.0847 11.7736L22.5661 20.6894L22.3677 23.4839L22.352 30.6225H17.6471L17.6318 23.4973L17.4327 20.6869L16.9139 11.7736L14.4707 5.17383H25.5283Z"
                fill="#F5841F"
              />
            </svg>
            <span className="flex-1 ms-3 whitespace-nowrap">
              Connect to MetaMask
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="flex items-center mt-4 p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
          >
            <svg
              aria-hidden="true"
              className="h-4"
              viewBox="0 0 40 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M39.0728 0L21.9092 12.6999L25.1009 5.21543L39.0728 0Z"
                fill="#E17726"
              />
              <path
                d="M0.966797 0.0151367L14.9013 5.21656L17.932 12.7992L0.966797 0.0151367Z"
                fill="#E27625"
              />
              <path
                d="M32.1656 27.0093L39.7516 27.1537L37.1004 36.1603L27.8438 33.6116L32.1656 27.0093Z"
                fill="#E27625"
              />
              <path
                d="M7.83409 27.0093L12.1399 33.6116L2.89876 36.1604L0.263672 27.1537L7.83409 27.0093Z"
                fill="#E27625"
              />
              <path
                d="M17.5203 10.8677L17.8304 20.8807L8.55371 20.4587L11.1924 16.4778L11.2258 16.4394L17.5203 10.8677Z"
                fill="#E27625"
              />
              <path
                d="M22.3831 10.7559L28.7737 16.4397L28.8067 16.4778L31.4455 20.4586L22.1709 20.8806L22.3831 10.7559Z"
                fill="#E27625"
              />
              <path
                d="M12.4115 27.0381L17.4768 30.9848L11.5928 33.8257L12.4115 27.0381Z"
                fill="#E27625"
              />
              <path
                d="M27.5893 27.0376L28.391 33.8258L22.5234 30.9847L27.5893 27.0376Z"
                fill="#E27625"
              />
              <path
                d="M22.6523 30.6128L28.6066 33.4959L23.0679 36.1282L23.1255 34.3884L22.6523 30.6128Z"
                fill="#D5BFB2"
              />
              <path
                d="M17.3458 30.6143L16.8913 34.3601L16.9286 36.1263L11.377 33.4961L17.3458 30.6143Z"
                fill="#D5BFB2"
              />
              <path
                d="M15.6263 22.1875L17.1822 25.4575L11.8848 23.9057L15.6263 22.1875Z"
                fill="#233447"
              />
              <path
                d="M24.3739 22.1875L28.133 23.9053L22.8184 25.4567L24.3739 22.1875Z"
                fill="#233447"
              />
              <path
                d="M12.8169 27.0049L11.9606 34.0423L7.37109 27.1587L12.8169 27.0049Z"
                fill="#CC6228"
              />
              <path
                d="M27.1836 27.0049L32.6296 27.1587L28.0228 34.0425L27.1836 27.0049Z"
                fill="#CC6228"
              />
              <path
                d="M31.5799 20.0605L27.6165 24.0998L24.5608 22.7034L23.0978 25.779L22.1387 20.4901L31.5799 20.0605Z"
                fill="#CC6228"
              />
              <path
                d="M8.41797 20.0605L17.8608 20.4902L16.9017 25.779L15.4384 22.7038L12.3988 24.0999L8.41797 20.0605Z"
                fill="#CC6228"
              />
              <path
                d="M8.15039 19.2314L12.6345 23.7816L12.7899 28.2736L8.15039 19.2314Z"
                fill="#E27525"
              />
              <path
                d="M31.8538 19.2236L27.2061 28.2819L27.381 23.7819L31.8538 19.2236Z"
                fill="#E27525"
              />
              <path
                d="M17.6412 19.5088L17.8217 20.6447L18.2676 23.4745L17.9809 32.166L16.6254 25.1841L16.625 25.1119L17.6412 19.5088Z"
                fill="#E27525"
              />
              <path
                d="M22.3562 19.4932L23.3751 25.1119L23.3747 25.1841L22.0158 32.1835L21.962 30.4328L21.75 23.4231L22.3562 19.4932Z"
                fill="#E27525"
              />
              <path
                d="M27.7797 23.6011L27.628 27.5039L22.8977 31.1894L21.9414 30.5138L23.0133 24.9926L27.7797 23.6011Z"
                fill="#F5841F"
              />
              <path
                d="M12.2373 23.6011L16.9873 24.9926L18.0591 30.5137L17.1029 31.1893L12.3723 27.5035L12.2373 23.6011Z"
                fill="#F5841F"
              />
              <path
                d="M10.4717 32.6338L16.5236 35.5013L16.4979 34.2768L17.0043 33.8323H22.994L23.5187 34.2753L23.48 35.4989L29.4935 32.641L26.5673 35.0591L23.0289 37.4894H16.9558L13.4197 35.0492L10.4717 32.6338Z"
                fill="#C0AC9D"
              />
              <path
                d="M22.2191 30.231L23.0748 30.8354L23.5763 34.8361L22.8506 34.2234H17.1513L16.4395 34.8485L16.9244 30.8357L17.7804 30.231H22.2191Z"
                fill="#161616"
              />
              <path
                d="M37.9395 0.351562L39.9998 6.53242L38.7131 12.7819L39.6293 13.4887L38.3895 14.4346L39.3213 15.1542L38.0875 16.2779L38.8449 16.8264L36.8347 19.1742L28.5894 16.7735L28.5179 16.7352L22.5762 11.723L37.9395 0.351562Z"
                fill="#763E1A"
              />
              <path
                d="M2.06031 0.351562L17.4237 11.723L11.4819 16.7352L11.4105 16.7735L3.16512 19.1742L1.15488 16.8264L1.91176 16.2783L0.678517 15.1542L1.60852 14.4354L0.350209 13.4868L1.30098 12.7795L0 6.53265L2.06031 0.351562Z"
                fill="#763E1A"
              />
              <path
                d="M28.1861 16.2485L36.9226 18.7921L39.7609 27.5398L32.2728 27.5398L27.1133 27.6049L30.8655 20.2912L28.1861 16.2485Z"
                fill="#F5841F"
              />
              <path
                d="M11.8139 16.2485L9.13399 20.2912L12.8867 27.6049L7.72971 27.5398H0.254883L3.07728 18.7922L11.8139 16.2485Z"
                fill="#F5841F"
              />
              <path
                d="M25.5283 5.17383L23.0847 11.7736L22.5661 20.6894L22.3677 23.4839L22.352 30.6225H17.6471L17.6318 23.4973L17.4327 20.6869L16.9139 11.7736L14.4707 5.17383H25.5283Z"
                fill="#F5841F"
              />
            </svg>
            <span className="flex-1 ms-3 whitespace-nowrap">
              Create MetaMask Wallet
            </span>
          </Link>
        </li>
      </ul>
      <div>
        <button
          onClick={() => setOpenModal(true)}
          className="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400"
        >
          <svg
            className="w-3 h-3 me-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7.529 7.988a2.502 2.502 0 0 1 5 .191A2.441 2.441 0 0 1 10 10.582V12m-.01 3.008H10M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          Why do I need to connect with my wallet?
        </button>
        <Modal show={openModal} onClose={() => setOpenModal(false)}>
          <Modal.Header>Metamask Wallet</Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Connecting your MetaMask wallet is essential for accessing our
                tokenization features and participating in the tokenization
                process of your property. Here's why it's necessary:
              </p>
              <h5 className="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">
                1. Ownership Verification:
              </h5>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Connecting your MetaMask wallet is essential for accessing our
                tokenization features and participating in the tokenization
                process of your property. Here's why it's necessary:
              </p>
              <h5 className="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">
                2. Token Management:
              </h5>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Your MetaMask wallet serves as your gateway to managing and
                interacting with the tokens representing your property
                ownership. It allows you to view, transfer, and trade your
                property tokens seamlessly.
              </p>
              <h5 className="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">
                3. Security:
              </h5>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                MetaMask provides a secure and decentralized environment for
                managing digital assets. It uses cryptographic principles to
                protect your private keys and transactions, reducing the risk of
                unauthorized access or fraud.
              </p>
              <h5 className="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">
                4. Smart Contract Interactions:
              </h5>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Our tokenization process relies on smart contracts deployed on
                the blockchain. By connecting your MetaMask wallet, you can
                interact with these smart contracts to execute tokenization
                transactions securely and transparently.
              </p>
              <h5 className="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">
                5. User Control:
              </h5>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Connecting your MetaMask wallet gives you full control over your
                property tokens and associated transactions. You can monitor
                activity, approve token transfers, and maintain ownership rights
                directly from your wallet interface.
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                In summary, connecting your MetaMask wallet is crucial for
                facilitating a smooth and secure tokenization experience,
                ensuring transparency, ownership verification, and user control
                throughout the process.
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                If you don't have a MetaMask wallet yet, you can easily create
                one by following the provided link. MetaMask is a widely used
                Ethereum wallet that enables seamless integration with
                decentralized applications like ours.
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                For any further questions or assistance, feel free to reach out
                to our support team.
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default WalletForm;
