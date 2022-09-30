import type { Page } from 'interfaces';
import { useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useCommissionContext } from 'context/CommissionContext';
import CommissionHeaderText from 'components/CommissionHeaderText/CommissionHeaderText';
import scrollToTop from 'helpers/smoothScroll';
import styles from './DescribeCharacters.module.css';

const c_maxFilesPerCharacter = 6;
const c_NumberToStringMap: {[key: number]: string} = {
  1: 'First',
  2: 'Second',
  3: 'Third',
};

const CommissionDescribeCharacters: Page = () => {
  const {
    spacesOpen,
    totalPrice,
    characters,
    baseType: selectedBaseType,
    dispatchUserState,
  } = useCommissionContext();

  const router = useRouter();
  useEffect(() => {
    if (spacesOpen === null) {
      router.push('/commission');
    }

    dispatchUserState({type: 'PAGE', payload: router.pathname});
  }, []);

  const refs = [
    {
      visInput: useRef<HTMLTextAreaElement>(null),
      persInput: useRef<HTMLTextAreaElement>(null),
      uploadInput: useRef<HTMLInputElement>(null),
    },
    {
      visInput: useRef<HTMLTextAreaElement>(null),
      persInput: useRef<HTMLTextAreaElement>(null),
      uploadInput: useRef<HTMLInputElement>(null),
    },
    {
      visInput: useRef<HTMLTextAreaElement>(null),
      persInput: useRef<HTMLTextAreaElement>(null),
      uploadInput: useRef<HTMLInputElement>(null),
    },
  ];

  return (
    <>
      <CommissionHeaderText title='Descibe Characters' priceTotal={totalPrice} />
      <div className={styles.containerDescribeCharacters}>
        <div className={styles.containerCharacterList}>
          {characters.map((character, i) => (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              className={styles.containerCharacterInfo}
              key={character.id}
            >
              <div className={styles.containerCharacterHeader}>
                <b>{c_NumberToStringMap[i + 1]} Character</b>
                {characters.length > 1
                  ? <button onClick={() => dispatchUserState({
                      type: 'CHARACTER-REMOVE',
                      payload: character.id,
                    })}>
                      Remove
                    </button>
                  : <></>
                }
              </div>
              <div className={styles.containerAllInputs}>
                <div>
                  <div className={styles.containerCharacterInput}>
                    <label htmlFor={`${character.id}-vis-desc`}>
                      Describe {c_NumberToStringMap[i + 1]} Character&apos;s Visual Appearance:
                    </label>
                    <textarea
                      ref={refs[i].visInput}
                      name={`${character.id}-vis-desc`}
                      value={character.visualDescription}
                      placeholder='Feel free to link some references here!'
                      onChange={e => dispatchUserState({
                        type: 'CHARACTER-UPDATE-VIS',
                        payload: { id: character.id, newValue: e.target.value },
                      })}
                    />
                  </div>
                  <div className={styles.containerCharacterInput}>
                    <label htmlFor={`${character.id}-pers-desc`}>
                      (Optional) Describe {c_NumberToStringMap[i + 1]} Character&apos;s Personality:
                    </label>
                    <textarea
                      ref={refs[i].persInput}
                      name={`${character.id}-pers-desc`}
                      value={character.personalityDescription}
                      onChange={e => dispatchUserState({
                        type: 'CHARACTER-UPDATE-PERS',
                        payload: { id: character.id, newValue: e.target.value },
                      })}
                    />
                  </div>
                </div>
                <div className={styles.containerFileUpload}>
                  <input
                    ref={refs[i].uploadInput}
                    style={{display: 'none'}}
                    type='file'
                    accept='image/*'
                    multiple={true}
                    onChange={e => {
                      if (!e?.target?.files) {
                        return;
                      }

                      const filesToAdd = [];
                      const tooBig = [];
                      const tooMany = [];
                      const numberOfExistingFiles = Object.keys(character.fileMap).length;
                      let numberOfNewFiles = 0;

                      for (const file of e.target.files) {
                        if (file.size > 2000000) {
                          tooBig.push(file.name);
                          continue;
                        }

                        if (numberOfExistingFiles + numberOfNewFiles === c_maxFilesPerCharacter) {
                          tooMany.push(file.name);
                          continue;
                        }

                        numberOfNewFiles++;
                        filesToAdd.push(file);
                      }

                      dispatchUserState({
                        type: 'CHARACTER-ADD-FILES',
                        payload: { id: character.id, files: filesToAdd },
                      });

                      let alertText = '';
                      if (tooBig.length) {
                        alertText += `The following images could not be added as they are above 2mb in size:\n\n${tooBig.join('\n')}\n\n`;
                      }
                      if (tooMany.length) {
                        alertText += `The following images could not be added as you have reached the maximum number of file uploads:\n\n${tooMany.join('\n')}`;
                      }
                      if (alertText) {
                        alert(alertText);
                      }
                    }}
                  />
                  <button
                    className='commission-btn'
                    onClick={() => refs[i].uploadInput.current?.click()}
                    disabled={Object.keys(character.fileMap).length === c_maxFilesPerCharacter}
                  >
                    {Object.keys(character.fileMap).length === c_maxFilesPerCharacter
                      ? 'Upload Limit Reached'
                      : `Add Images For ${c_NumberToStringMap[i + 1]} Character`
                    }
                  </button>
                  <div className={styles.containerAllFiles}>
                    {Object.keys(character.fileMap).map(fileName => (
                      <div key={fileName} className={styles.containerFile}>
                        <b>{fileName}</b>
                        <span onClick={() => dispatchUserState({
                          type: 'CHARACTER-REMOVE-FILE',
                          payload: { id: character.id, fileName: fileName }
                        })}>
                          X
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {characters.length < 3
          ? <div className={styles.containerAddMore}>
              <button
                className='commission-btn'
                onClick={() => dispatchUserState({ type: 'CHARACTER-ADD' })}
              >
                Add Another Character (+${selectedBaseType?.actualPrice})
              </button>
            </div>
          : <></>
        }
        <div className='commissionsContainerButton'>
          <button
            onClick={() => {
              scrollToTop().then(() => router.push('/commission/selectBackground'));
            }}
            className='commission-btn'
          >
            Back
          </button>
          <button
            onClick={() => {
              let errorFound: number | null = null;
              for (let i = 0; i < characters.length; i++) {
                const { visInput } = refs[i];
                if (!visInput.current) {
                  return;
                }

                visInput.current.classList.remove('warning');
                void visInput.current.offsetWidth;

                if (!characters[i].visualDescription) {
                  visInput.current.placeholder = 'You must enter something here';
                  visInput.current.classList.add('warning');

                  if (errorFound === null) {
                    errorFound = i;
                  }
                }
              }

              if (errorFound !== null) {
                refs[errorFound].visInput.current?.scrollIntoView({behavior: 'smooth'});
                return;
              }

              scrollToTop().then(() => router.push('/commission/finalise'));
            }}
            className='commission-btn'
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

CommissionDescribeCharacters.title = 'Describe Commission Characters';
CommissionDescribeCharacters.dontStick = true;

export default CommissionDescribeCharacters;
