export function Offer() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">ПУБЛИЧНАЯ ОФЕРТА (YODDA)</h1>
        <p className="text-muted-foreground mb-8">(редакция от октября 2025 г.)</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Общие положения</h2>
          <p className="mb-3">
            <strong>1.1.</strong> Настоящая Публичная оферта (далее — «Оферта») является официальным
            предложением платформы Yodda (далее — «Платформа», «Компания») заключить договор на оказание
            услуг по предоставлению онлайн-сервиса для взаимодействия между репетиторами и учениками.
          </p>
          <p className="mb-3">
            <strong>1.2.</strong> Принятие условий настоящей Оферты (акцепт) осуществляется путем регистрации
            на сайте{' '}
            <a href="https://www.yodda.online" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              www.yodda.online
            </a>
            .
          </p>
          <p>
            <strong>1.3.</strong> Используя Платформу, Пользователь подтверждает, что ознакомился и согласен с
            условиями настоящей Оферты, Политикой конфиденциальности и иными документами, размещёнными на
            сайте.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Предмет соглашения</h2>
          <p className="mb-3">
            <strong>2.1.</strong> Платформа предоставляет техническую возможность:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-3">
            <li>
              <strong>Репетиторам</strong> — создавать анкету, указывать предметы, расписание и получать
              учеников;
            </li>
            <li>
              <strong>Ученикам</strong> — выбирать репетитора, бронировать пробный урок и связываться с
              преподавателем.
            </li>
          </ul>
          <p className="mb-3">
            <strong>2.2.</strong> Платформа не является образовательным учреждением и не несёт ответственности
            за качество и содержание уроков.
          </p>
          <p>
            <strong>2.3.</strong> Платформа выступает посредником (платёжным агентом) между учениками и
            репетиторами, обеспечивая прозрачные расчёты и безопасность сделок.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Регистрация и использование</h2>
          <p className="mb-3">
            <strong>3.1.</strong> Для начала работы Пользователь обязан создать личный кабинет, указав
            достоверные данные.
          </p>
          <p className="mb-3">
            <strong>3.2.</strong> Репетиторы несут ответственность за корректность указанного расписания, цен и
            выполнения обязательств перед учениками, а также обязаны соблюдать сроки оплаты за лида.
          </p>
          <p className="mb-3">
            <strong>3.3.</strong> Платформа имеет право временно ограничить или приостановить доступ в случае
            нарушения правил.
          </p>
          <p>
            <strong>3.4.</strong> Пользователь несёт персональную ответственность за сохранность данных для
            входа.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Права и обязанности сторон</h2>
          <p className="mb-2">
            <strong>Репетитор обязан:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>проводить уроки в соответствии с заявленным расписанием;</li>
            <li>использовать достоверные данные в анкете;</li>
            <li>обеспечивать качество и честность обучения;</li>
            <li>соблюдать сроки оплаты за лида.</li>
          </ul>
          <p className="mb-2">
            <strong>Ученик обязан:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>корректно взаимодействовать с репетитором;</li>
            <li>не передавать данные доступа третьим лицам;</li>
            <li>соблюдать правила бронирования и отмены уроков.</li>
          </ul>
          <p className="mb-2">
            <strong>Платформа обязуется:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>обеспечивать стабильную работу сервиса;</li>
            <li>защищать персональные данные пользователей;</li>
            <li>обеспечивать прозрачные расчёты между сторонами.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Платёжный агент и порядок выплат</h2>
          <p className="mb-3">
            <strong>5.1.</strong> Платформа Yodda выступает платёжным агентом между учениками и репетиторами.
          </p>
          <p className="mb-3">
            <strong>5.2.</strong> Все платежи принимаются через Платформу.
          </p>
          <p className="mb-3">
            <strong>5.3.</strong> Репетитор самостоятельно несёт ответственность за уплату налогов и законность
            своей деятельности.
          </p>
          <p>
            <strong>5.4.</strong> Платформа не является работодателем и не удерживает налоги за репетиторов.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Комиссии и налоги</h2>
          <p className="mb-3">
            <strong>6.1.</strong> Комиссия Платформы удерживается в соответствии с тарифами, опубликованными
            на сайте.
          </p>
          <p className="mb-3">
            <strong>6.2.</strong> Эквайерская комиссия (1,5%) платёжной системы удерживается дополнительно к
            комиссии Платформы и не является её доходом.
          </p>
          <p>
            <strong>6.3.</strong> Платформа самостоятельно уплачивает налог 4% от своей комиссионной выручки.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Пробные уроки</h2>
          <p className="mb-3">
            <strong>7.1. Пробные уроки бесплатны для учеников.</strong>
            <br />
            Ученик может забронировать пробный урок с любым репетитором без оплаты.
          </p>
          <p className="mb-3">
            <strong>7.2. Репетитор не получает оплату за проведение пробного урока.</strong>
            <br />
            После бронирования учеником пробного урока репетитор обязан оплатить фиксированную сумму за
            предоставленный лид.
          </p>
          <p>
            <strong>7.3.</strong> Если ученик подтвердил бронь, но не явился на урок, оплата за лида остаётся
            обязательной.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Оплата за приведённого ученика (лида)</h2>
          <p className="mb-3">
            <strong>8.1.</strong> Репетитор соглашается, что после получения нового ученика, пришедшего через
            Yodda и забронировавшего пробный урок, он обязан оплатить Платформе фиксированную сумму
            вознаграждения за предоставление лида.
          </p>
          <p className="mb-3">
            <strong>8.2.</strong> Оплата производится внутри Yodda через встроенную систему платежей.
          </p>
          <p className="mb-3">
            <strong>8.3.</strong> Пробный урок и последующие занятия могут проходить в любом формате по выбору
            сторон — через Telegram, Google Meet, Zoom или оффлайн. Платформа не вмешивается в процесс
            обучения.
          </p>
          <p className="mb-3">
            <strong>8.4.</strong> Репетитор обязан оплатить стоимость лида в течение 24 часов с момента
            подтверждения бронирования пробного урока учеником.
          </p>
          <p className="mb-2">
            <strong>8.5. В случае неоплаты:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-3">
            <li>заявка ученика передаётся другому репетитору;</li>
            <li>рейтинг репетитора понижается;</li>
            <li>доступ к новым лидам блокируется до оплаты.</li>
          </ul>
          <p className="mb-3">
            <strong>8.6.</strong> Оплата взимается даже если ученик не явился на пробный урок, при условии
            подтверждения брони.
          </p>
          <p className="mb-3">
            <strong>8.7.</strong> Стоимость лида устанавливается Платформой и может различаться в зависимости
            от предмета и спроса.
          </p>
          <p>
            <strong>8.8.</strong> Все расчёты осуществляются в узбекских сумах (UZS).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Отмена и возвраты</h2>
          <p className="mb-3">
            <strong>9.1.</strong> Возврат средств возможен только в случаях ошибочного платежа.
          </p>
          <p className="mb-3">
            <strong>9.2.</strong> Возврат осуществляется тем же способом, которым была произведена оплата, в
            течение 10 рабочих дней.
          </p>
          <p>
            <strong>9.3.</strong> Платформа имеет право удержать эквайерскую комиссию (1,5%) при возврате.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Запрет обхода платформы</h2>
          <p className="mb-2">
            <strong>10.1. Пользователям запрещается:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-3">
            <li>совершать оплату услуг в обход Платформы;</li>
            <li>
              обмениваться контактами (телефон, Telegram, Instagram и т.д.) с целью проведения занятий вне
              Yodda;
            </li>
            <li>предлагать оплату или уроки без бронирования через Yodda.</li>
          </ul>
          <p className="mb-3">
            <strong>10.2.</strong> При выявлении факта обхода анкета репетитора удаляется, доступ к сервису
            блокируется без права восстановления.
          </p>
          <p>
            <strong>10.3.</strong> Ученики, нарушившие правила, теряют доступ без возврата средств.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Возрастные ограничения</h2>
          <p>
            <strong>11.1.</strong> Пользователи младше 18 лет могут пользоваться Yodda только с согласия
            родителей или законных представителей.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Конфиденциальность</h2>
          <p className="mb-3">
            <strong>12.1.</strong> Платформа обрабатывает персональные данные в соответствии с Политикой
            конфиденциальности.
          </p>
          <p>
            <strong>12.2.</strong> Все данные хранятся в зашифрованном виде и не передаются третьим лицам без
            согласия пользователя.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Заключительные положения</h2>
          <p className="mb-3">
            <strong>13.1.</strong> Настоящая Оферта вступает в силу с момента её акцепта пользователем.
          </p>
          <p className="mb-3">
            <strong>13.2.</strong> Платформа оставляет за собой право изменять условия с уведомлением на сайте.
          </p>
          <p>
            <strong>13.3.</strong> Все споры решаются путём переговоров, при невозможности — в судах Республики
            Узбекистан.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">14. Контактная информация</h2>
          <p className="mb-2">
            <strong>ООО «YODDA» (Yodda MCHJ)</strong>
            <br />
            ИНН (СТИР): 312338727
          </p>
          <p className="mb-2">
            📍 <strong>Адрес:</strong> Республика Узбекистан, г. Ташкент, Шайхонтохурский район, МФЙ Янги
            Шаҳар, ул. Кўкча дарвоза 1-тор, дом 14
          </p>
          <p className="mb-2">
            📧 <strong>E-mail:</strong>{' '}
            <a href="mailto:support@yodda.online" className="text-primary hover:underline">
              support@yodda.online
            </a>
          </p>
          <p className="mb-2">
            📞 <strong>Телефон:</strong>{' '}
            <a href="tel:+998940444581" className="text-primary hover:underline">
              +998 94 044 4581
            </a>
          </p>
          <p>
            🌐 <strong>Сайт:</strong>{' '}
            <a href="https://www.yodda.online" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              www.yodda.online
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
