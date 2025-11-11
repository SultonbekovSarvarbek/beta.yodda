export function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">Политика конфиденциальности</h1>
        <p className="text-muted-foreground mb-8">Редакция от 10 сентября 2025 года</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Общие положения</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Настоящая Политика разработана в соответствии с Законом Республики Узбекистан 'О персональных
              данных' от 2 июля 2019 года и устанавливает порядок сбора, обработки, хранения и защиты
              персональных данных пользователей Платформы Yodda Online, предназначенной для поиска
              репетиторов и образовательных курсов.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Персональные данные, которые мы собираем</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Мы собираем только те персональные данные, которые необходимы для предоставления услуг и
              выполнения наших обязательств перед пользователями.
            </li>
            <li>
              Информация о поисковых запросах и просматриваемых курсах или репетиторах.
            </li>
            <li>
              Техническая информация: IP-адрес, данные о браузере, тип устройства.
            </li>
            <li>
              Мы используем cookie-файлы для анализа работы Платформы, хранения пользовательских
              предпочтений и улучшения пользовательского опыта. Вся информация, собранная через cookie,
              используется в соответствии с настоящей Политикой.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Цели сбора данных</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Для регистрации и идентификации пользователей на Платформе.</li>
            <li>Для предоставления доступа к услугам (поиск репетиторов, размещение анкет и т.д.).</li>
            <li>Для персонализации контента и улучшения качества сервиса.</li>
            <li>Для связи с пользователями (уведомления, новости, подтверждения).</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Передача данных третьим лицам</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Мы не продаём, не передаём и не раскрываем ваши персональные данные третьим лицам, за
              исключением следующих случаев:
            </li>
            <li>Выполнение требований законодательства.</li>
            <li>Для выполнения платежных операций (передача данных платежным системам).</li>
            <li>С согласия пользователя.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Защита данных</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Мы применяем современные методы защиты персональных данных, включая шифрование, ограничение
              доступа, регулярные проверки безопасности.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Срок хранения данных</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Персональные данные хранятся в течение срока, необходимого для достижения целей их обработки,
              либо до момента отзыва согласия пользователя. Исключением являются случаи, когда их
              дальнейшее хранение требуется законодательством.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Пользователи имеют право:</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Запросить доступ к своим данным.</li>
            <li>
              Изменить или удалить свои данные, отправив запрос на{' '}
              <a href="mailto:help@yodda.online" className="text-primary hover:underline">
                help@yodda.online
              </a>{' '}
              или воспользовавшись настройками аккаунта.
            </li>
            <li>Отказаться от обработки данных.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Контакты</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Если у вас есть вопросы по обработке персональных данных, свяжитесь с нами:{' '}
              <a href="mailto:info@yodda.online" className="text-primary hover:underline">
                info@yodda.online
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
