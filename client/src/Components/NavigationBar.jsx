// 상단 네비게이션 바 컴포넌트

import { useAuth } from '../Contexts/Auth'

function NavigationBar({}) {
  const { logout } = useAuth()

  return (
    <nav className='bg-white shadow-md sticky top-0 z-30'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <span className='text-xl font-bold text-indigo-600'>
                근무 스케줄
              </span>
            </div>
            <div className='hidden md:block'>
              <div className='ml-10 flex items-baseline space-x-4'>
                <a
                  href='#'
                  className='bg-indigo-50 text-indigo-700 px-3 py-2 rounded-md text-sm font-medium'
                >
                  스케줄 표
                </a>
                <a
                  href='#'
                  className='text-gray-500 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium'
                >
                  팀 관리
                </a>
                <a
                  href='#'
                  className='text-gray-500 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium'
                >
                  설정
                </a>
              </div>
            </div>
          </div>
          <div className='hidden md:block'>
            <button
              onClick={logout}
              className='px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition'
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavigationBar
