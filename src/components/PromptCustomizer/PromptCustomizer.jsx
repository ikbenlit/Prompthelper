import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { generateContent } from '../../services/openAIService';
import Modal from '../Modal/Modal';
import SearchableDropdown from '../SearchableDropdown/SearchableDropdown';
import InfoTooltip from '../InfoTooltip/InfoTooltip';
import CopyButton from '../Button/CopyButton';

export default function PromptCustomizer({ prompt, tones, styles, targets, roles, initialCustomization }) {
  const { t } = useTranslation();
  const [selectedTone, setSelectedTone] = useState(initialCustomization?.tone || '');
  const [selectedStyle, setSelectedStyle] = useState(initialCustomization?.style || '');
  const [customizedPrompt, setCustomizedPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(initialCustomization?.target || '');
  const [selectedRole, setSelectedRole] = useState(initialCustomization?.role || '');
  const selectedToneDescription = tones?.find(t => t.tone_name === selectedTone)?.tone_description;

  useEffect(() => {
    if (prompt) {
      setCustomizedPrompt(initialCustomization?.customizedPrompt || prompt.prompt);
    }
  }, [prompt, initialCustomization]);

  const updatePrompt = (tone, style, target, role) => {
    let newPrompt = '';
    
    if (tone) {
      const selectedTone = tones.find(t => t.tone_name === tone);
      if (selectedTone) {
        newPrompt += `${t('customize.labels.tone')}: ${selectedTone.tone_name} - ${selectedTone.tone_description}\n\n`;
      }
    }
    
    if (style) {
      const selectedStyle = styles.find(s => s.Name === style);
      if (selectedStyle) {
        newPrompt += `${t('customize.labels.style')}: ${selectedStyle.Name} - ${selectedStyle.Effect}\n\n`;
      }
    }

    if (target) {
      const selectedTarget = targets.find(t => t.id === target);
      if (selectedTarget) {
        newPrompt += `${t('customize.labels.target')}: ${selectedTarget.name} - ${selectedTarget.description}\n\n`;
      }
    }

    if (role) {
      const selectedRole = roles.find(r => r.id === role);
      if (selectedRole) {
        newPrompt += `${t('customize.labels.role')}: ${selectedRole.name} - ${selectedRole.description}\n\n`;
      }
    }

    newPrompt += `Prompt:\n${prompt.prompt}`;

    setCustomizedPrompt(newPrompt);
  };

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const content = await generateContent(customizedPrompt);
      setGeneratedContent(content);
      setIsModalOpen(true);
    } catch (err) {
      setError(t('errors.generation'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-[1fr,1.5fr] gap-6">
        {/* Left Column - Search Bars */}
        <div className="space-y-6">
          {/* Tone Selection */}
          <div>
            <SearchableDropdown
              options={tones?.map(tone => ({
                Name: tone.tone_name,
                Effect: tone.tone_description,
                id: tone.tone_id
              }))}
              value={selectedTone || ''}
              onChange={(value) => {
                const tone = tones?.find(t => t.tone_name === value);
                console.log('Selected tone:', tone);
                setSelectedTone(tone?.tone_name || '');
                updatePrompt(tone?.tone_name || '', selectedStyle, selectedTarget, selectedRole);
              }}
              label={t('customize.selectTone')}
              placeholder={t('customize.noTone')}
              helpText={t('tooltips:customize.tone')}
            />
          </div>

          {/* Style Selection */}
          <div>
            <SearchableDropdown
              options={styles}
              value={selectedStyle}
              onChange={(value) => {
                setSelectedStyle(value);
                updatePrompt(selectedTone, value, selectedTarget, selectedRole);
              }}
              label={t('customize.selectStyle')}
              placeholder={t('customize.noStyle')}
              helpText={t('tooltips:customize.style')}
            />
          </div>

          {/* Target Selection */}
          <div>
            <SearchableDropdown
              options={targets?.map(target => ({
                Name: target.name,
                Effect: target.description,
                id: target.id
              }))}
              value={targets?.find(t => t.id === selectedTarget)?.name || ''}
              onChange={(value) => {
                const target = targets.find(t => t.name === value);
                setSelectedTarget(target?.id || '');
                updatePrompt(selectedTone, selectedStyle, target?.id || '', selectedRole);
              }}
              label={t('customize.selectTarget')}
              placeholder={t('customize.noTarget')}
              helpText={t('tooltips:customize.target')}
            />
          </div>

          {/* Role Selection */}
          <div>
            <SearchableDropdown
              options={roles?.map(role => ({
                Name: role.name,
                Effect: role.description,
                id: role.id
              }))}
              value={roles?.find(r => r.id === selectedRole)?.name || ''}
              onChange={(value) => {
                const role = roles.find(r => r.name === value);
                setSelectedRole(role?.id || '');
                updatePrompt(selectedTone, selectedStyle, selectedTarget, role?.id || '');
              }}
              label={t('customize.selectRole')}
              placeholder={t('customize.noRole')}
              helpText={t('tooltips:customize.role')}
            />
          </div>
        </div>

        {/* Right Column - Prompt Editor */}
        <div className="space-y-2 flex flex-col mt-4 md:mt-6">
          {/* Prompt Editor */}
          <div className="mb-1">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div className="space-y-1">
                <label className="block text-base text-gray-900 dark:text-white">
                  {t('customize.promptText')}
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl">
                  {t('tooltips:customize.editor')}
                </p>
              </div>
              <CopyButton
                text={customizedPrompt}
                variant="primary"
                className="min-w-[120px] justify-center sm:self-start flex-shrink-0"
              />
            </div>
          </div>
          <div className="relative">
            <textarea
              value={customizedPrompt}
              onChange={(e) => setCustomizedPrompt(e.target.value)}
              className="w-full h-96 p-4 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white resize-none"
              placeholder={t('customize.editPrompt')}
            />
          </div>
          <div className="flex flex-col gap-3 mt-4">
            <button
              onClick={() => {
                navigator.clipboard.writeText(customizedPrompt)
                  .then(() => {
                    alert('Prompt is gekopieerd naar je klembord. Je kunt deze nu in ChatGPT plakken.');
                    window.open('https://chat.openai.com/chat', '_blank');
                  })
                  .catch(err => {
                    console.error('Kon prompt niet kopiëren:', err);
                    alert('Er ging iets mis bij het kopiëren. Open ChatGPT en kopieer de prompt handmatig.');
                    window.open('https://chat.openai.com/chat', '_blank');
                  });
              }}
              className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 text-center font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0314 3.8065L12.53 8.3257l2.02-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4024-.6813zm2.0107-3.0089l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
              </svg>
              Kopieer je custom prompt en ga naar ChatGPT
            </button>

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? t('actions.generating') : t('actions.makeContent')}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Generated Content Modal */}
      <div className="relative z-[200]">
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-col h-full max-h-[80vh]">
            <h2 className="text-2xl font-bold mb-4">{t('generate.result')}</h2>
            
            <div className="flex-1 overflow-y-auto mb-4">
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{generatedContent}</p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-gray-800 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg transition-colors"
              >
                {t('actions.close')}
              </button>
              <CopyButton
                text={generatedContent}
                variant="primary"
              />
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
} 