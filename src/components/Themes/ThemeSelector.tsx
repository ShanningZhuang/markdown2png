import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useTheme } from './ThemeProvider'
import type { ThemeId } from '@/types'
import { clsx } from 'clsx'

interface ThemeSelectorProps {
  currentTheme: ThemeId
  onThemeChange: (themeId: ThemeId) => void
}

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const { themes } = useTheme()

  const themeList = Object.values(themes)

  return (
    <div className="w-64">
      <Listbox value={currentTheme} onChange={onThemeChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
            <div className="flex items-center">
              <div 
                className="h-4 w-4 rounded-full mr-3 border border-gray-300"
                style={{ backgroundColor: themes[currentTheme].colors.background }}
              />
              <span className="block truncate font-medium">
                {themes[currentTheme].name}
              </span>
            </div>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-96 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {themeList.map((theme) => (
                <Listbox.Option
                  key={theme.id}
                  className={({ active }) =>
                    clsx(
                      'relative cursor-pointer select-none py-2 pl-3 pr-9',
                      active ? 'bg-blue-600 text-white' : 'text-gray-900'
                    )
                  }
                  value={theme.id}
                >
                  {({ selected, active }) => (
                    <>
                      <div className="flex items-center">
                        <div 
                          className="h-4 w-4 rounded-full mr-3 border border-gray-300"
                          style={{ backgroundColor: theme.colors.background }}
                        />
                        <div className="flex flex-col">
                          <span
                            className={clsx(
                              'block truncate font-medium',
                              selected ? 'font-semibold' : 'font-normal'
                            )}
                          >
                            {theme.name}
                          </span>
                          <span 
                            className={clsx(
                              'text-xs truncate',
                              active ? 'text-blue-200' : 'text-gray-500'
                            )}
                          >
                            {theme.description}
                          </span>
                        </div>
                      </div>

                      {selected ? (
                        <span
                          className={clsx(
                            'absolute inset-y-0 right-0 flex items-center pr-4',
                            active ? 'text-white' : 'text-blue-600'
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}
