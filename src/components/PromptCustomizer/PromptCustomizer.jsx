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
        newPrompt += `Toon: ${selectedTone.tone_name} - ${selectedTone.tone_description}\n\n`;
      }
    }
    
    if (style) {
      const selectedStyle = styles.find(s => s.Name === style);
      if (selectedStyle) {
        newPrompt += `Stijl: ${selectedStyle.Name} - ${selectedStyle.Effect}\n\n`;
      }
    }

    if (target) {
      const selectedTarget = targets.find(t => t.id === target);
      if (selectedTarget) {
        newPrompt += `Doelgroep: ${selectedTarget.name} - ${selectedTarget.description}\n\n`;
      }
    }

    if (role) {
      const selectedRole = roles.find(r => r.id === role);
      if (selectedRole) {
        newPrompt += `Rol: ${selectedRole.name} - ${selectedRole.description}\n\n`;
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
          <div className="relative group bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
            <textarea
              value={customizedPrompt}
              onChange={(e) => setCustomizedPrompt(e.target.value)}
              className="w-full p-4 rounded-lg min-h-[420px] resize-none text-sm leading-relaxed bg-transparent border-none focus:ring-0"
              placeholder={t('customize.editPrompt')}
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className={`w-full mt-4 flex items-center justify-center px-6 py-3 rounded-lg transition-colors ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t('actions.generating')}
              </span>
            ) : (
              t('actions.makeContent')
            )}
          </button>
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