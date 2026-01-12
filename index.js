const {
  Client,
  GatewayIntentBits,
  Events,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require("discord.js");

const accounts = require("./accounts");
const bank = require("./bank");
const credit = require("./credit");
const admin = require("./admin");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const sessions = new Map(); // discordId => username
const installments = new Map(); // discordId => data

client.once("ready", () => {
  console.log("✅ Bot Ready");
});

// ========= أوامر =========
client.on(Events.InteractionCreate, async i => {
  if (!i.isChatInputCommand()) return;

  if (i.commandName === "start") {
    return i.reply({
      ephemeral: true,
      content: "🔐 تسجيل دخول المستخدم",
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("login")
            .setLabel("تسجيل الدخول")
            .setStyle(ButtonStyle.Primary)
        )
      ]
    });
  }

  if (i.commandName === "admin") {
    if (!admin.isAdmin(i.member))
      return i.reply({ ephemeral: true, content: "❌ ليس لديك صلاحية" });

    return i.reply({
      ephemeral: true,
      content: "🛡️ لوحة الإدارة",
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("admin_login_user")
            .setLabel("الدخول على حساب مستخدم")
            .setStyle(ButtonStyle.Secondary)
        )
      ]
    });
  }
});

// ========= أزرار =========
client.on(Events.InteractionCreate, async i => {
  if (!i.isButton()) return;

  // تسجيل دخول
  if (i.customId === "login") {
    const modal = new ModalBuilder()
      .setCustomId("login_modal")
      .setTitle("تسجيل الدخول");

    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("username")
          .setLabel("اسم المستخدم")
          .setStyle(TextInputStyle.Short)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("password")
          .setLabel("كلمة المرور")
          .setStyle(TextInputStyle.Short)
      )
    );

    return i.showModal(modal);
  }

  // سداد
  if (i.customId === "pay") {
    const data = installments.get(i.user.id);
    if (!data) return i.reply({ ephemeral: true, content: "❌ لا يوجد تقسيط" });

    if (!bank.deductBalance(i.user.id, data.part))
      return i.reply({ ephemeral: true, content: "❌ الرصيد غير كافي" });

    data.left--;
    credit.success(i.user.id);

    if (data.left <= 0) {
      installments.delete(i.user.id);
      return i.reply({ ephemeral: true, content: "✅ تم سداد التقسيط كامل" });
    }

    return i.reply({ ephemeral: true, content: "💸 تم سداد دفعة" });
  }
});

// ========= Modals =========
client.on(Events.InteractionCreate, async i => {
  if (!i.isModalSubmit()) return;

  if (i.customId === "login_modal") {
    const username = i.fields.getTextInputValue("username");
    const password = i.fields.getTextInputValue("password");

    const acc = accounts.login(username, password);
    if (!acc) {
      return i.reply({ ephemeral: true, content: "❌ بيانات خاطئة" });
    }

    sessions.set(i.user.id, username);

    return i.reply({
      ephemeral: true,
      content: `✅ أهلاً ${username}`,
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("pay")
            .setLabel("💸 سداد دفعة")
            .setStyle(ButtonStyle.Success)
        )
      ]
    });
  }
});

client.login(process.env.TOKEN);
